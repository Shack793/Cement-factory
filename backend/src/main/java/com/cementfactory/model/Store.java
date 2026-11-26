package com.cementfactory.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "stores")
public class Store extends BaseEntity {
    @Column(nullable = false, unique = true, length = 30)
    private String code;
    @Column(nullable = false)
    private String name;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StoreType type;
    /** Capacity in kg; null means no limit. */
    @Column(precision = 16, scale = 2)
    private BigDecimal capacityKg;
    /** A silo holds one grade only (PDF 3.3): the item it is assigned to. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_item_id")
    private Item assignedItem;
    private boolean active = true;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public StoreType getType() { return type; }
    public void setType(StoreType type) { this.type = type; }
    public BigDecimal getCapacityKg() { return capacityKg; }
    public void setCapacityKg(BigDecimal capacityKg) { this.capacityKg = capacityKg; }
    public Item getAssignedItem() { return assignedItem; }
    public void setAssignedItem(Item assignedItem) { this.assignedItem = assignedItem; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
