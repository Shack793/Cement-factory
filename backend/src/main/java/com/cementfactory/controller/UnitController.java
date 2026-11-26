package com.cementfactory.controller;

import com.cementfactory.dto.ConversionDto;
import com.cementfactory.dto.UnitDto;
import com.cementfactory.service.UnitService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/units")
public class UnitController {
    private final UnitService service;

    public UnitController(UnitService service) { this.service = service; }

    @GetMapping
    public List<UnitDto> list() { return service.list(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UnitDto create(@Valid @RequestBody UnitDto dto) { return service.create(dto); }

    @GetMapping("/convert")
    public ConversionDto convert(@RequestParam String from, @RequestParam String to, @RequestParam BigDecimal qty) {
        return service.convert(from, to, qty);
    }
}
