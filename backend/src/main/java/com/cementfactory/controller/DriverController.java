package com.cementfactory.controller;

import com.cementfactory.dto.DriverDto;
import com.cementfactory.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {
    private final DriverService service;

    public DriverController(DriverService service) { this.service = service; }

    @GetMapping
    public List<DriverDto> list() { return service.list(); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DriverDto create(@Valid @RequestBody DriverDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public DriverDto update(@PathVariable Long id, @Valid @RequestBody DriverDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}
