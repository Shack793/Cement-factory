package com.cementfactory.service;

import com.cementfactory.dto.*;
import com.cementfactory.exception.BusinessRuleException;
import com.cementfactory.exception.NotFoundException;
import com.cementfactory.model.*;
import com.cementfactory.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Stock ledger rules from the PDF: balances are In - Out (3.7), a silo holds one grade (3.3),
 * stock cannot go negative, capacity is respected, and large adjustments need approval (4.2).
 */
@Service
@Transactional
public class StockService {
    private static final Set<ItemType> WATCHED = EnumSet.of(ItemType.RAW_MATERIAL, ItemType.PACKAGING);

    private final StoreRepository stores;
    private final ItemRepository items;
    private final LotRepository lots;
    private final StockMovementRepository moves;
    private final UnitRepository units;
    private final BigDecimal approvalKg;

    public StockService(StoreRepository stores, ItemRepository items, LotRepository lots, StockMovementRepository moves,
                        UnitRepository units, @Value("${app.stock.adjustment-approval-kg:5000}") BigDecimal approvalKg) {
        this.stores = stores; this.items = items; this.lots = lots; this.moves = moves; this.units = units;
        this.approvalKg = approvalKg;
    }

    // ---------------- queries ----------------
    @Transactional(readOnly = true)
    public List<StoreDto> listStores() {
        Map<Long, Item> itemMap = items.findAll().stream().collect(Collectors.toMap(Item::getId, i -> i));
        List<BalanceRow> rows = moves.balances(MovementStatus.POSTED);
        List<StoreDto> out = new ArrayList<>();
        for (Store s : stores.findAll()) {
            List<BalanceLineDto> lines = new ArrayList<>();
            BigDecimal usedKg = BigDecimal.ZERO;
            for (BalanceRow r : rows) {
                if (!r.getStoreId().equals(s.getId()) || r.getQuantity().signum() == 0) continue;
                BalanceLineDto l = line(s, itemMap.get(r.getItemId()), r.getQuantity());
                lines.add(l);
                usedKg = usedKg.add(l.quantityKg());
            }
            Double pct = null;
            if (s.getCapacityKg() != null && s.getCapacityKg().signum() > 0) {
                pct = usedKg.multiply(BigDecimal.valueOf(100)).divide(s.getCapacityKg(), 1, RoundingMode.HALF_UP).doubleValue();
            }
            Item a = s.getAssignedItem();
            out.add(new StoreDto(s.getId(), s.getCode(), s.getName(), s.getType(), s.getCapacityKg(),
                    a == null ? null : a.getId(), a == null ? null : a.getCode(), s.isActive(), usedKg, pct, lines));
        }
        out.sort(Comparator.comparing(StoreDto::id));
        return out;
    }

    @Transactional(readOnly = true)
    public List<BalanceLineDto> balances(Long storeId) {
        List<BalanceLineDto> all = new ArrayList<>();
        for (StoreDto s : listStores()) {
            if (storeId == null || storeId.equals(s.id())) all.addAll(s.lines());
        }
        return all;
    }

    /** Raw materials and packaging whose total stock is below the reorder level (PDF 4.2 Raw material stock). */
    @Transactional(readOnly = true)
    public List<LowStockDto> lowStock() {
        Map<Long, BigDecimal> totals = new HashMap<>();
        for (BalanceRow r : moves.balances(MovementStatus.POSTED)) totals.merge(r.getItemId(), r.getQuantity(), BigDecimal::add);
        List<LowStockDto> out = new ArrayList<>();
        for (Item i : items.findAll()) {
            if (!WATCHED.contains(i.getType()) || i.getReorderLevelKg() == null) continue;
            BigDecimal qty = totals.getOrDefault(i.getId(), BigDecimal.ZERO);
            BigDecimal kg = toKg(i, qty);
            if (kg.compareTo(i.getReorderLevelKg()) < 0) {
                out.add(new LowStockDto(i.getId(), i.getCode(), i.getName(), i.getBaseUnit(), qty, kg,
                        i.getReorderLevelKg(), i.getReorderLevelKg().subtract(kg)));
            }
        }
        return out;
    }

    @Transactional(readOnly = true)
    public List<MovementDto> movements(Long storeId, int limit) {
        PageRequest page = PageRequest.of(0, Math.max(1, Math.min(limit, 200)));
        List<StockMovement> list = storeId == null ? moves.recent(page) : moves.recentForStore(storeId, page);
        return list.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<MovementDto> pendingAdjustments() {
        return moves.findByStatusOrderByIdDesc(MovementStatus.PENDING).stream().map(this::toDto).toList();
    }

    // ---------------- commands ----------------
    public StoreDto createStore(StoreDto d) {
        String code = d.code().trim().toUpperCase();
        if (stores.existsByCode(code)) throw new BusinessRuleException("Store code already exists: " + code);
        Store s = new Store();
        s.setCode(code);
        s.setName(d.name());
        s.setType(d.type());
        s.setCapacityKg(d.capacityKg());
        if (d.assignedItemId() != null) s.setAssignedItem(item(d.assignedItemId()));
        stores.save(s);
        return listStores().stream().filter(x -> x.id().equals(s.getId())).findFirst().orElseThrow();
    }

    public MovementDto receive(StockRequest r) {
        Store s = store(r.storeId());
        Item i = item(r.itemId());
        BigDecimal qty = toBase(i, r.quantity(), r.unit());
        checkSiloRule(s, i);
        checkCapacity(s, toKg(i, qty));
        return toDto(post(s, i, lotFor(i, r.lotCode()), qty, MovementType.RECEIPT, MovementStatus.POSTED,
                r.reference(), null, null, null));
    }

    public MovementDto issue(StockRequest r) {
        Store s = store(r.storeId());
        Item i = item(r.itemId());
        BigDecimal qty = toBase(i, r.quantity(), r.unit());
        requireBalance(s, i, qty);
        return toDto(post(s, i, lotFor(i, r.lotCode()), qty.negate(), MovementType.ISSUE, MovementStatus.POSTED,
                r.reference(), null, null, null));
    }

    public List<MovementDto> transfer(TransferRequest r) {
        if (r.fromStoreId().equals(r.toStoreId())) throw new BusinessRuleException("Source and destination store must differ");
        Store from = store(r.fromStoreId());
        Store to = store(r.toStoreId());
        Item i = item(r.itemId());
        BigDecimal qty = toBase(i, r.quantity(), r.unit());
        requireBalance(from, i, qty);
        checkSiloRule(to, i);
        checkCapacity(to, toKg(i, qty));
        String group = UUID.randomUUID().toString();
        StockMovement out = post(from, i, null, qty.negate(), MovementType.TRANSFER_OUT, MovementStatus.POSTED, r.reference(), null, null, group);
        StockMovement in = post(to, i, null, qty, MovementType.TRANSFER_IN, MovementStatus.POSTED, r.reference(), null, null, group);
        return List.of(toDto(out), toDto(in));
    }

    /** Adjustments at or above the approval limit are held as PENDING until approved. */
    public MovementDto adjust(AdjustmentRequest r) {
        Store s = store(r.storeId());
        Item i = item(r.itemId());
        BigDecimal qty = toBase(i, r.quantity(), r.unit());
        if (qty.signum() == 0) throw new BusinessRuleException("Adjustment quantity cannot be zero");
        if (qty.signum() < 0) requireBalance(s, i, qty.abs());
        else { checkSiloRule(s, i); checkCapacity(s, toKg(i, qty)); }
        boolean needsApproval = toKg(i, qty.abs()).compareTo(approvalKg) >= 0;
        return toDto(post(s, i, null, qty, MovementType.ADJUSTMENT, needsApproval ? MovementStatus.PENDING : MovementStatus.POSTED,
                null, r.reasonCode().trim().toUpperCase(), r.note(), null));
    }

    public MovementDto approveAdjustment(Long id) {
        StockMovement m = pending(id);
        if (m.getQuantity().signum() < 0) requireBalance(m.getStore(), m.getItem(), m.getQuantity().abs());
        m.setStatus(MovementStatus.POSTED);
        return toDto(moves.save(m));
    }

    public MovementDto rejectAdjustment(Long id) {
        StockMovement m = pending(id);
        m.setStatus(MovementStatus.REJECTED);
        return toDto(moves.save(m));
    }

    /** Used by the seeder and data migration (PDF 4.1 Data import: opening stock). */
    public void openingBalance(String storeCode, String itemCode, BigDecimal baseQty) {
        Store s = stores.findByCode(storeCode).orElseThrow(() -> new NotFoundException("Store", storeCode));
        Item i = items.findAll().stream().filter(x -> x.getCode().equals(itemCode)).findFirst()
                .orElseThrow(() -> new NotFoundException("Item", itemCode));
        post(s, i, null, baseQty, MovementType.OPENING, MovementStatus.POSTED, "OPENING", null, null, null);
    }

    /** Programmatic balance lookup for other modules (production, weighbridge, loading). */
    @Transactional(readOnly = true)
    public BigDecimal balanceOf(Long storeId, Long itemId) {
        return moves.balance(storeId, itemId, MovementStatus.POSTED);
    }

    // ---------------- helpers ----------------
    private StockMovement post(Store s, Item i, Lot lot, BigDecimal signedQty, MovementType type, MovementStatus status,
                               String reference, String reason, String note, String group) {
        StockMovement m = new StockMovement();
        m.setStore(s); m.setItem(i); m.setLot(lot); m.setQuantity(signedQty); m.setType(type); m.setStatus(status);
        m.setReference(reference); m.setReasonCode(reason); m.setNote(note); m.setGroupRef(group);
        return moves.save(m);
    }

    private void requireBalance(Store s, Item i, BigDecimal needed) {
        BigDecimal have = moves.balance(s.getId(), i.getId(), MovementStatus.POSTED);
        if (have.compareTo(needed) < 0) {
            throw new BusinessRuleException("Insufficient stock of " + i.getCode() + " in " + s.getCode()
                    + ": have " + have.stripTrailingZeros().toPlainString() + " " + i.getBaseUnit()
                    + ", need " + needed.stripTrailingZeros().toPlainString());
        }
    }

    private void checkSiloRule(Store s, Item i) {
        Item a = s.getAssignedItem();
        if (s.getType() == StoreType.SILO && a != null && !a.getId().equals(i.getId())) {
            throw new BusinessRuleException("Silo " + s.getCode() + " holds only " + a.getCode() + ", not " + i.getCode());
        }
    }

    private void checkCapacity(Store s, BigDecimal addKg) {
        if (s.getCapacityKg() == null) return;
        Map<Long, Item> itemMap = items.findAll().stream().collect(Collectors.toMap(Item::getId, x -> x));
        BigDecimal used = BigDecimal.ZERO;
        for (BalanceRow r : moves.balances(MovementStatus.POSTED)) {
            if (r.getStoreId().equals(s.getId())) used = used.add(toKg(itemMap.get(r.getItemId()), r.getQuantity()));
        }
        if (used.add(addKg).compareTo(s.getCapacityKg()) > 0) {
            throw new BusinessRuleException("Store " + s.getCode() + " capacity exceeded: capacity "
                    + s.getCapacityKg().stripTrailingZeros().toPlainString() + " kg, would hold "
                    + used.add(addKg).stripTrailingZeros().toPlainString() + " kg");
        }
    }

    private Lot lotFor(Item i, String code) {
        if (code == null || code.isBlank()) return null;
        String c = code.trim().toUpperCase();
        Optional<Lot> existing = lots.findByCode(c);
        if (existing.isPresent()) {
            if (!existing.get().getItem().getId().equals(i.getId())) throw new BusinessRuleException("Lot " + c + " belongs to another item");
            return existing.get();
        }
        Lot l = new Lot();
        l.setCode(c);
        l.setItem(i);
        return lots.save(l);
    }

    private BigDecimal factor(String unit) {
        return units.findByCode(unit.trim().toUpperCase()).map(UnitOfMeasure::getKgFactor)
                .orElseThrow(() -> new BusinessRuleException("Unknown unit: " + unit));
    }

    /** Convert a quantity given in any unit into the item's base unit. */
    private BigDecimal toBase(Item i, BigDecimal qty, String unit) {
        if (unit == null || unit.isBlank() || unit.equalsIgnoreCase(i.getBaseUnit())) return qty;
        return qty.multiply(factor(unit)).divide(factor(i.getBaseUnit()), 3, RoundingMode.HALF_UP);
    }

    private BigDecimal toKg(Item i, BigDecimal baseQty) { return baseQty.multiply(factor(i.getBaseUnit())); }

    private BalanceLineDto line(Store s, Item i, BigDecimal qty) {
        return new BalanceLineDto(s.getId(), s.getCode(), i.getId(), i.getCode(), i.getName(), i.getBaseUnit(), qty, toKg(i, qty));
    }

    private MovementDto toDto(StockMovement m) {
        return new MovementDto(m.getId(), m.getStore().getCode(), m.getItem().getCode(), m.getItem().getName(),
                m.getLot() == null ? null : m.getLot().getCode(), m.getQuantity(), m.getItem().getBaseUnit(), m.getType(),
                m.getStatus(), m.getReference(), m.getReasonCode(), m.getNote(), m.getCreatedAt());
    }

    private StockMovement pending(Long id) {
        StockMovement m = moves.findById(id).orElseThrow(() -> new NotFoundException("Movement", id));
        if (m.getStatus() != MovementStatus.PENDING) throw new BusinessRuleException("Movement " + id + " is not pending approval");
        return m;
    }

    private Store store(Long id) { return stores.findById(id).orElseThrow(() -> new NotFoundException("Store", id)); }
    private Item item(Long id) { return items.findById(id).orElseThrow(() -> new NotFoundException("Item", id)); }
}
