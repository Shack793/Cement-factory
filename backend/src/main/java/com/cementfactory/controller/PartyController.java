package com.cementfactory.controller;

import com.cementfactory.dto.PartyDto;
import com.cementfactory.model.PartyStatus;
import com.cementfactory.model.PartyType;
import com.cementfactory.service.PartyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/parties")
public class PartyController {
    private final PartyService service;

    public PartyController(PartyService service) { this.service = service; }

    @GetMapping
    public List<PartyDto> list(@RequestParam(required = false) PartyType type) { return service.list(type); }

    @GetMapping("/{id}")
    public PartyDto get(@PathVariable Long id) { return service.get(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PartyDto create(@Valid @RequestBody PartyDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public PartyDto update(@PathVariable Long id, @Valid @RequestBody PartyDto dto) { return service.update(id, dto); }

    @PatchMapping("/{id}/status")
    public PartyDto status(@PathVariable Long id, @RequestParam PartyStatus value) { return service.setStatus(id, value); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}
