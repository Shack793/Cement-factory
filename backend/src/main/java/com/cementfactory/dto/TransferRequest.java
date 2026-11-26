package com.cementfactory.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record TransferRequest(@NotNull Long fromStoreId, @NotNull Long toStoreId, @NotNull Long itemId,
                              @NotNull @DecimalMin(value = "0.001", message = "must be positive") BigDecimal quantity,
                              String unit, String reference) {}
