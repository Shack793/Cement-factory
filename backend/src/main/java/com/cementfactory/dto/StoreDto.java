package com.cementfactory.dto;

import com.cementfactory.model.StoreType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

/** Request fields: code, name, type, capacityKg, assignedItemId. The rest is filled in on responses. */
public record StoreDto(Long id, @NotBlank String code, @NotBlank String name, @NotNull StoreType type,
                       BigDecimal capacityKg, Long assignedItemId, String assignedItemCode, Boolean active,
                       BigDecimal usedKg, Double utilizationPct, List<BalanceLineDto> lines) {}
