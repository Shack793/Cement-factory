package com.cementfactory.dto;

import java.math.BigDecimal;

public record LowStockDto(Long itemId, String itemCode, String itemName, String unit, BigDecimal quantity,
                          BigDecimal quantityKg, BigDecimal reorderLevelKg, BigDecimal shortfallKg) {}
