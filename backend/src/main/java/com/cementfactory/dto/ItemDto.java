package com.cementfactory.dto;

import com.cementfactory.model.Item;
import com.cementfactory.model.ItemType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ItemDto(Long id, @NotBlank String code, @NotBlank String name, @NotNull ItemType type,
                      @NotBlank String baseUnit, String grade, BigDecimal reorderLevelKg, Boolean active) {
    public static ItemDto from(Item i) {
        return new ItemDto(i.getId(), i.getCode(), i.getName(), i.getType(), i.getBaseUnit(), i.getGrade(),
                i.getReorderLevelKg(), i.isActive());
    }
}
