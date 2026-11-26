package com.cementfactory.dto;

import java.math.BigDecimal;

public record BalanceLineDto(Long storeId, String storeCode, Long itemId, String itemCode, String itemName,
                             String unit, BigDecimal quantity, BigDecimal quantityKg) {}
