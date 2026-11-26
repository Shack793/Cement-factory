package com.cementfactory.config;

import com.cementfactory.model.*;
import com.cementfactory.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

/** Loads the cement master data described in the PDF on first start (sections 3.2, 3.4, 3.8, 4.1). */
@Component
@Order(1)
public class DataSeeder implements CommandLineRunner {
    private final UnitRepository units;
    private final ItemRepository items;
    private final PartyRepository parties;
    private final VehicleRepository vehicles;
    private final DriverRepository drivers;

    public DataSeeder(UnitRepository units, ItemRepository items, PartyRepository parties,
                      VehicleRepository vehicles, DriverRepository drivers) {
        this.units = units; this.items = items; this.parties = parties; this.vehicles = vehicles; this.drivers = drivers;
    }

    @Override
    public void run(String... args) {
        if (units.count() == 0) {
            unit("KG", "Kilogram", "1");
            unit("MT", "Tonne", "1000");
            unit("BAG", "Bag (50 kg)", "50");
            unit("PALLET", "Pallet (40 bags)", "2000");
            unit("JUMBO", "Jumbo bag (1 MT)", "1000");
        }
        if (items.count() == 0) {
            item("CLINKER", "Clinker", ItemType.RAW_MATERIAL, "MT", null, "250000");
            item("GYPSUM", "Gypsum", ItemType.RAW_MATERIAL, "MT", null, "20000");
            item("FLYASH", "Fly ash / slag", ItemType.RAW_MATERIAL, "MT", null, "30000");
            item("LIMESTONE", "Limestone (own kiln only)", ItemType.RAW_MATERIAL, "MT", null, null);
            item("CLAY", "Clay / shale (own kiln only)", ItemType.RAW_MATERIAL, "MT", null, null);
            item("PACKBAG", "Empty packing bag 50 kg", ItemType.PACKAGING, "BAG", null, "20000");
            item("CEM425R-BULK", "Cement 42.5R powder (silo)", ItemType.SEMI_FINISHED, "MT", "42.5R", null);
            item("CEM325R-BULK", "Cement 32.5R powder (silo)", ItemType.SEMI_FINISHED, "MT", "32.5R", null);
            item("CEM425R-50", "Super Strong 42.5R, 50 kg bag", ItemType.FINISHED, "BAG", "42.5R", null);
            item("CEM325R-50", "Super Rapid 32.5R, 50 kg bag", ItemType.FINISHED, "BAG", "32.5R", null);
            item("CEM425N-50", "Extra / Premium 42.5N, 50 kg bag", ItemType.FINISHED, "BAG", "42.5N", null);
        }
        if (parties.count() == 0) {
            Party agent = party("AG-001", "Kwame Mensah Trading", PartyType.AGENT, "Greater Accra", "0.00", 0);
            Party clinkerSupplier = party("SUP-001", "Anatolia Clinker Ltd", PartyType.SUPPLIER, "Turkey", "0.00", 30);
            clinkerSupplier.setPort("Tema Port");
            parties.save(clinkerSupplier);
            party("SUP-002", "Volta Gypsum Mines", PartyType.SUPPLIER, "Volta", "0.00", 0);
            Party d1 = party("DIS-001", "Asante Building Supplies", PartyType.DISTRIBUTOR, "Ashanti", "100000.00", 14);
            d1.setAgent(agent);
            party("DIS-002", "Tema Block Works", PartyType.DISTRIBUTOR, "Greater Accra", "250000.00", 30);
            parties.save(agent);
            parties.save(d1);
        }
        if (vehicles.count() == 0) {
            vehicle("GT-1234-24", "14200", "30000", "50000", "Own fleet");
            vehicle("AS-5521-23", "15100", "32000", "50000", "Kofi Transport");
        }
        if (drivers.count() == 0) {
            Driver a = new Driver(); a.setName("Yaw Boateng"); a.setLicenseNo("DL-0012345"); a.setPhone("0244000001");
            Driver b = new Driver(); b.setName("Ama Serwaa"); b.setLicenseNo("DL-0098765"); b.setPhone("0244000002");
            drivers.save(a); drivers.save(b);
        }
    }

    private void unit(String code, String name, String kg) {
        UnitOfMeasure u = new UnitOfMeasure(); u.setCode(code); u.setName(name); u.setKgFactor(new BigDecimal(kg));
        units.save(u);
    }

    private void item(String code, String name, ItemType type, String unit, String grade, String reorderKg) {
        Item i = new Item(); i.setCode(code); i.setName(name); i.setType(type); i.setBaseUnit(unit); i.setGrade(grade);
        if (reorderKg != null) i.setReorderLevelKg(new BigDecimal(reorderKg));
        items.save(i);
    }

    private Party party(String code, String name, PartyType type, String region, String limit, int terms) {
        Party p = new Party(); p.setCode(code); p.setName(name); p.setType(type); p.setRegion(region);
        p.setCreditLimit(new BigDecimal(limit)); p.setPaymentTermsDays(terms);
        if (type == PartyType.SUPPLIER && "Turkey".equals(region)) p.setCountry("Turkey");
        return parties.save(p);
    }

    private void vehicle(String reg, String tare, String cap, String gross, String owner) {
        Vehicle v = new Vehicle(); v.setRegistration(reg); v.setStoredTareKg(new BigDecimal(tare));
        v.setCapacityKg(new BigDecimal(cap)); v.setGrossLimitKg(new BigDecimal(gross)); v.setOwnerName(owner);
        vehicles.save(v);
    }
}
