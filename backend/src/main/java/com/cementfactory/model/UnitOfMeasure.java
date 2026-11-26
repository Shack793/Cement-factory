package com.cementfactory.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

/** Unit with its weight in kg, so bag, pallet, tonne and kg convert without hand calculation (PDF 3.4). */
@Entity
@Table(name = "units")
public class UnitOfMeasure extends BaseEntity {
    @Column(nullable = false, unique = true, length = 10)
    private String code;
    @Column(nullable = false)
    private String name;
    @Column(nullable = false, precision = 14, scale = 4)
    private BigDecimal kgFactor;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public BigDecimal getKgFactor() { return kgFactor; }
    public void setKgFactor(BigDecimal kgFactor) { this.kgFactor = kgFactor; }
}
