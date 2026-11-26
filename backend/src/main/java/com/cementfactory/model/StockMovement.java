package com.cementfactory.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

/** One line of the stock ledger. Balances are always the sum of POSTED movements: In - Out = Balance (PDF 3.7). */
@Entity
@Table(name = "stock_movements", indexes = {
        @Index(name = "idx_mv_store_item", columnList = "store_id,item_id")})
public class StockMovement extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "store_id")
    private Store store;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_id")
    private Item item;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lot_id")
    private Lot lot;
    /** Signed quantity in the item's base unit: positive in, negative out. */
    @Column(nullable = false, precision = 16, scale = 3)
    private BigDecimal quantity;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovementType type;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MovementStatus status = MovementStatus.POSTED;
    private String reference;
    /** Links the two legs of a transfer. */
    private String groupRef;
    private String reasonCode;
    private String note;

    public Store getStore() { return store; }
    public void setStore(Store store) { this.store = store; }
    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }
    public Lot getLot() { return lot; }
    public void setLot(Lot lot) { this.lot = lot; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public MovementType getType() { return type; }
    public void setType(MovementType type) { this.type = type; }
    public MovementStatus getStatus() { return status; }
    public void setStatus(MovementStatus status) { this.status = status; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public String getGroupRef() { return groupRef; }
    public void setGroupRef(String groupRef) { this.groupRef = groupRef; }
    public String getReasonCode() { return reasonCode; }
    public void setReasonCode(String reasonCode) { this.reasonCode = reasonCode; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
