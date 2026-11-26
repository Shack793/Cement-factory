package com.cementfactory.controller;

import com.cementfactory.dto.ItemDto;
import com.cementfactory.model.ItemType;
import com.cementfactory.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/items")
public class ItemController {
    private final ItemService service;

    public ItemController(ItemService service) { this.service = service; }

    @GetMapping
    public List<ItemDto> list(@RequestParam(required = false) ItemType type) { return service.list(type); }

    @GetMapping("/{id}")
    public ItemDto get(@PathVariable Long id) { return service.get(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ItemDto create(@Valid @RequestBody ItemDto dto) { return service.create(dto); }

    @PutMapping("/{id}")
    public ItemDto update(@PathVariable Long id, @Valid @RequestBody ItemDto dto) { return service.update(id, dto); }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}
