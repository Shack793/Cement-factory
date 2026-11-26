package com.cementfactory.controller;

import com.cementfactory.dto.*;
import com.cementfactory.service.StockService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stock")
public class StockController {
    private final StockService service;

    public StockController(StockService service) { this.service = service; }

    @GetMapping("/balances")
    public List<BalanceLineDto> balances(@RequestParam(required = false) Long storeId) { return service.balances(storeId); }

    @GetMapping("/low")
    public List<LowStockDto> low() { return service.lowStock(); }

    @GetMapping("/movements")
    public List<MovementDto> movements(@RequestParam(required = false) Long storeId,
                                       @RequestParam(defaultValue = "50") int limit) {
        return service.movements(storeId, limit);
    }

    @GetMapping("/adjustments/pending")
    public List<MovementDto> pending() { return service.pendingAdjustments(); }

    @PostMapping("/receipts")
    @ResponseStatus(HttpStatus.CREATED)
    public MovementDto receive(@Valid @RequestBody StockRequest r) { return service.receive(r); }

    @PostMapping("/issues")
    @ResponseStatus(HttpStatus.CREATED)
    public MovementDto issue(@Valid @RequestBody StockRequest r) { return service.issue(r); }

    @PostMapping("/transfers")
    @ResponseStatus(HttpStatus.CREATED)
    public List<MovementDto> transfer(@Valid @RequestBody TransferRequest r) { return service.transfer(r); }

    @PostMapping("/adjustments")
    @ResponseStatus(HttpStatus.CREATED)
    public MovementDto adjust(@Valid @RequestBody AdjustmentRequest r) { return service.adjust(r); }

    @PostMapping("/adjustments/{id}/approve")
    public MovementDto approve(@PathVariable Long id) { return service.approveAdjustment(id); }

    @PostMapping("/adjustments/{id}/reject")
    public MovementDto reject(@PathVariable Long id) { return service.rejectAdjustment(id); }
}
