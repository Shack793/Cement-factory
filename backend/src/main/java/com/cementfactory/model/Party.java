package com.cementfactory.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

/** Supplier, customer, distributor or agent (PDF 4.1 Parties and 7.2 Account structure). */
@Entity
@Table(name = "parties")
public class Party extends BaseEntity {
    @Column(nullable = false, unique = true, length = 40)
    private String code;
    @Column(nullable = false)
    private String name;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PartyType type;
    private String phone;
    private String email;
    private String region;
    private String address;
    /** Suppliers of imported clinker: origin country and port (PDF 3.2). */
    private String country;
    private String port;
    @Column(precision = 16, scale = 2)
    private BigDecimal creditLimit = BigDecimal.ZERO;
    private int paymentTermsDays = 0;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PartyStatus status = PartyStatus.ACTIVE;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id")
    private Party agent;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public PartyType getType() { return type; }
    public void setType(PartyType type) { this.type = type; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getPort() { return port; }
    public void setPort(String port) { this.port = port; }
    public BigDecimal getCreditLimit() { return creditLimit; }
    public void setCreditLimit(BigDecimal creditLimit) { this.creditLimit = creditLimit; }
    public int getPaymentTermsDays() { return paymentTermsDays; }
    public void setPaymentTermsDays(int paymentTermsDays) { this.paymentTermsDays = paymentTermsDays; }
    public PartyStatus getStatus() { return status; }
    public void setStatus(PartyStatus status) { this.status = status; }
    public Party getAgent() { return agent; }
    public void setAgent(Party agent) { this.agent = agent; }
}
