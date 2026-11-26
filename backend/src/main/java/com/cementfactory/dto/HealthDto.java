package com.cementfactory.dto;

import java.time.Instant;

public record HealthDto(String status, String service, String version, Instant time) {}
