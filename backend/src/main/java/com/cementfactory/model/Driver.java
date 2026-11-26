package com.cementfactory.model;

import jakarta.persistence.*;

@Entity
@Table(name = "drivers")
public class Driver extends BaseEntity {
    @Column(nullable = false)
    private String name;
    @Column(unique = true)
    private String licenseNo;
    private String phone;
    private String idNumber;
    private boolean active = true;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLicenseNo() { return licenseNo; }
    public void setLicenseNo(String licenseNo) { this.licenseNo = licenseNo; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getIdNumber() { return idNumber; }
    public void setIdNumber(String idNumber) { this.idNumber = idNumber; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
