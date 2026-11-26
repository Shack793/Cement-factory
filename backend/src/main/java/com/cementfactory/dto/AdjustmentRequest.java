package com.cementfactory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/** Signed quantity: positive adds stock, negative removes it. A reason code is mandatory (PDF 4.2). */
public record AdjustmentRequest(@NotNull Long storeId, @NotNull Long itemId, @NotNull BigDecimal quantity,
                                String unit, @NotBlank String reasonCode, String note) {}
