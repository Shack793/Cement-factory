package com.cementfactory.service;

import com.cementfactory.dto.ItemDto;
import com.cementfactory.exception.BusinessRuleException;
import com.cementfactory.exception.NotFoundException;
import com.cementfactory.model.Item;
import com.cementfactory.model.ItemType;
import com.cementfactory.repository.ItemRepository;
import com.cementfactory.repository.UnitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class ItemService {
    private final ItemRepository repo;
    private final UnitRepository units;

    public ItemService(ItemRepository repo, UnitRepository units) { this.repo = repo; this.units = units; }

    @Transactional(readOnly = true)
    public List<ItemDto> list(ItemType type) {
        List<Item> items = type == null ? repo.findAll() : repo.findByTypeOrderByCodeAsc(type);
        return items.stream().map(ItemDto::from).toList();
    }

    @Transactional(readOnly = true)
    public ItemDto get(Long id) { return ItemDto.from(find(id)); }

    public ItemDto create(ItemDto d) {
        String code = d.code().trim().toUpperCase();
        if (repo.existsByCode(code)) throw new BusinessRuleException("Item code already exists: " + code);
        requireUnit(d.baseUnit());
        Item i = new Item();
        apply(i, d);
        i.setCode(code);
        return ItemDto.from(repo.save(i));
    }

    public ItemDto update(Long id, ItemDto d) {
        Item i = find(id);
        requireUnit(d.baseUnit());
        apply(i, d);
        return ItemDto.from(repo.save(i));
    }

    public void delete(Long id) { repo.delete(find(id)); }

    private void apply(Item i, ItemDto d) {
        i.setName(d.name());
        i.setType(d.type());
        i.setBaseUnit(d.baseUnit().toUpperCase());
        i.setGrade(d.grade());
        i.setReorderLevelKg(d.reorderLevelKg());
        i.setActive(d.active() == null || d.active());
    }

    private void requireUnit(String code) {
        if (!units.existsByCode(code.toUpperCase())) throw new BusinessRuleException("Unknown unit: " + code);
    }

    private Item find(Long id) { return repo.findById(id).orElseThrow(() -> new NotFoundException("Item", id)); }
}
