package com.cementfactory.service;

import com.cementfactory.dto.HealthDto;
import org.springframework.stereotype.Service;
import java.time.Instant;

@Service
public class HealthService {
    public HealthDto status() {
        return new HealthDto("UP", "cement-factory", "0.1.0", Instant.now());
    }
}
