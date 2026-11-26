package com.cementfactory.config;

import com.cementfactory.model.*;
import com.cementfactory.repository.ItemRepository;
import com.cementfactory.repository.StoreRepository;
import com.cementfactory.service.StockService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;

/** Creates the stores of PDF 4.2 and opening stock. Runs after DataSeeder (needs items and units). */
@Component
@Order(2)
public class StockSeeder implements CommandLineRunner {
    private final StoreRepository stores;
    private final ItemRepository items;
    private final StockService stock;

    public StockSeeder(StoreRepository stores, ItemRepository items, StockService stock) {
        this.stores = stores; this.items = items; this.stock = stock;
    }

    @Override
    public void run(String... args) {
        if (stores.count() > 0) return;
        store("RAW-YARD", "Raw Material Yard", StoreType.RAW_YARD, "20000000", null);
        store("PACKAGING", "Packaging store", StoreType.PACKAGING, null, null);
        store("MFG-ROOM", "Manufacturing Room (work in progress)", StoreType.MANUFACTURING_ROOM, null, null);
        store("SILO-CLK", "Silo 1 - Clinker", StoreType.SILO, "1000000", "CLINKER");
        store("SILO-425", "Silo 2 - Cement 42.5R", StoreType.SILO, "500000", "CEM425R-BULK");
        store("SILO-325", "Silo 3 - Cement 32.5R", StoreType.SILO, "500000", "CEM325R-BULK");
        store("FG-WH", "Finished Goods Warehouse", StoreType.FINISHED_GOODS, "2500000", null);
        store("QUARANTINE", "Quarantine", StoreType.QUARANTINE, null, null);

        // Opening stock (base units: MT for materials and silos, BAG for packing and finished bags).
        stock.openingBalance("RAW-YARD", "CLINKER", new BigDecimal("300"));
        stock.openingBalance("RAW-YARD", "GYPSUM", new BigDecimal("8"));      // below reorder level: shows the shortage alert
        stock.openingBalance("RAW-YARD", "FLYASH", new BigDecimal("40"));
        stock.openingBalance("PACKAGING", "PACKBAG", new BigDecimal("25000"));
        stock.openingBalance("SILO-CLK", "CLINKER", new BigDecimal("500"));
        stock.openingBalance("SILO-425", "CEM425R-BULK", new BigDecimal("180"));
        stock.openingBalance("SILO-325", "CEM325R-BULK", new BigDecimal("120"));
        stock.openingBalance("FG-WH", "CEM425R-50", new BigDecimal("4000"));
        stock.openingBalance("FG-WH", "CEM325R-50", new BigDecimal("2500"));
    }

    private void store(String code, String name, StoreType type, String capKg, String assignedItemCode) {
        Store s = new Store();
        s.setCode(code);
        s.setName(name);
        s.setType(type);
        if (capKg != null) s.setCapacityKg(new BigDecimal(capKg));
        if (assignedItemCode != null) {
            s.setAssignedItem(items.findAll().stream().filter(i -> i.getCode().equals(assignedItemCode)).findFirst().orElseThrow());
        }
        stores.save(s);
    }
}
