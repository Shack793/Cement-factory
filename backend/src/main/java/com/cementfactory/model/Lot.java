package com.cementfactory.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/** Lot or batch for traceability: a bag must trace back to its run and raw material lots (PDF 4.8). */
@Entity
@Table(name = "lots")
public class Lot extends BaseEntity {
    @Column(nullable = false, unique = true, length = 40)
    private String code;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "item_id")
    private Item item;
    private LocalDate receivedOn = LocalDate.now();
    private String note;

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }
    public LocalDate getReceivedOn() { return receivedOn; }
    public void setReceivedOn(LocalDate receivedOn) { this.receivedOn = receivedOn; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
