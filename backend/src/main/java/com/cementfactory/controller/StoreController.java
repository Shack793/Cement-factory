package com.cementfactory.controller;

import com.cementfactory.dto.StoreDto;
import com.cementfactory.service.StockService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stores")
public class StoreController {
    private final StockService service;

    public StoreController(StockService service) { this.service = service; }

    /** Every store with its balance lines, used capacity and utilisation (the three stock points, PDF 3.1). */
    @GetMapping
    public List<StoreDto> list() { return service.listStores(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StoreDto create(@Valid @RequestBody StoreDto dto) { return service.createStore(dto); }
}
