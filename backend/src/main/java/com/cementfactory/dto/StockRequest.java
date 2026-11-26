package com.cementfactory.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/** Used for both receipts and issues. Quantity is positive; unit defaults to the item's base unit. */
public record StockRequest(@NotNull Long storeId, @NotNull Long itemId,
                           @NotNull @DecimalMin(value = "0.001", message = "must be positive") BigDecimal quantity,
                           String unit, String lotCode, String reference) {}
