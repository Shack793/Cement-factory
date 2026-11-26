package com.cementfactory.dto;

import com.cementfactory.model.Vehicle;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public record VehicleDto(Long id, @NotBlank String registration, BigDecimal storedTareKg, BigDecimal capacityKg,
                         BigDecimal grossLimitKg, String ownerName, Boolean active) {
    public static VehicleDto from(Vehicle v) {
        return new VehicleDto(v.getId(), v.getRegistration(), v.getStoredTareKg(), v.getCapacityKg(),
                v.getGrossLimitKg(), v.getOwnerName(), v.isActive());
    }
}
