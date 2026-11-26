package com.cementfactory.dto;

import com.cementfactory.model.MovementStatus;
import com.cementfactory.model.MovementType;
import java.math.BigDecimal;
import java.time.Instant;

public record MovementDto(Long id, String storeCode, String itemCode, String itemName, String lotCode,
                          BigDecimal quantity, String unit, MovementType type, MovementStatus status,
                          String reference, String reasonCode, String note, Instant createdAt) {}
