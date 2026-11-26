package com.cementfactory.dto;

import java.math.BigDecimal;

public record ConversionDto(String from, String to, BigDecimal quantity, BigDecimal result) {}
