package com.cementfactory.dto;

import com.cementfactory.model.UnitOfMeasure;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record UnitDto(Long id, @NotBlank String code, @NotBlank String name,
                      @NotNull @DecimalMin(value = "0.0001", message = "must be positive") BigDecimal kgFactor) {
    public static UnitDto from(UnitOfMeasure u) { return new UnitDto(u.getId(), u.getCode(), u.getName(), u.getKgFactor()); }
}
