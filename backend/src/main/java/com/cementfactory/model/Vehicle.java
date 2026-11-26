package com.cementfactory.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

/** Truck with stored tare and capacity, used by the weighbridge checks (PDF 10.3, 10.10). */
@Entity
@Table(name = "vehicles")
public class Vehicle extends BaseEntity {
    @Column(nullable = false, unique = true, length = 20)
    private String registration;
    @Column(precision = 12, scale = 2)
    private BigDecimal storedTareKg;
    @Column(precision = 12, scale = 2)
    private BigDecimal capacityKg;
    @Column(precision = 12, scale = 2)
    private BigDecimal grossLimitKg;
    private String ownerName;
    private boolean active = true;

    public String getRegistration() { return registration; }
    public void setRegistration(String registration) { this.registration = registration; }
    public BigDecimal getStoredTareKg() { return storedTareKg; }
    public void setStoredTareKg(BigDecimal storedTareKg) { this.storedTareKg = storedTareKg; }
    public BigDecimal getCapacityKg() { return capacityKg; }
    public void setCapacityKg(BigDecimal capacityKg) { this.capacityKg = capacityKg; }
    public BigDecimal getGrossLimitKg() { return grossLimitKg; }
    public void setGrossLimitKg(BigDecimal grossLimitKg) { this.grossLimitKg = grossLimitKg; }
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
