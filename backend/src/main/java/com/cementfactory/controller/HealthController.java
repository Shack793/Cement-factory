package com.cementfactory.controller;

import com.cementfactory.dto.HealthDto;
import com.cementfactory.service.HealthService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {
    private final HealthService service;

    public HealthController(HealthService service) { this.service = service; }

    @GetMapping
    public HealthDto health() { return service.status(); }
}
