package com.cementfactory.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

/** Raw material, silo cement, finished product or packaging (PDF 4.1 Products and raw materials). */
@Entity
@Table(name = "items")
public class Item extends BaseEntity {
    @Column(nullable = false, unique = true, length = 40)
    private String code;
    @Column(nullable = false)
    private String name;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemType type;
    @Column(nullable = false, length = 10)
    private String baseUnit;
    private String grade;
    @Column(precision = 14, scale = 3)
    private BigDecimal reorderLevelKg;
    private boolean active = true;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public ItemType getType() { return type; }
    public void setType(ItemType type) { this.type = type; }
    public String getBaseUnit() { return baseUnit; }
    public void setBaseUnit(String baseUnit) { this.baseUnit = baseUnit; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public BigDecimal getReorderLevelKg() { return reorderLevelKg; }
    public void setReorderLevelKg(BigDecimal reorderLevelKg) { this.reorderLevelKg = reorderLevelKg; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
