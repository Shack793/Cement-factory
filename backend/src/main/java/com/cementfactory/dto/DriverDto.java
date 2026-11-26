package com.cementfactory.dto;

import com.cementfactory.model.Driver;
import jakarta.validation.constraints.NotBlank;

public record DriverDto(Long id, @NotBlank String name, String licenseNo, String phone, String idNumber, Boolean active) {
    public static DriverDto from(Driver d) {
        return new DriverDto(d.getId(), d.getName(), d.getLicenseNo(), d.getPhone(), d.getIdNumber(), d.isActive());
    }
}
