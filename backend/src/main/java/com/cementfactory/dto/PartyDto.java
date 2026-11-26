package com.cementfactory.dto;

import com.cementfactory.model.Party;
import com.cementfactory.model.PartyStatus;
import com.cementfactory.model.PartyType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record PartyDto(Long id, @NotBlank String code, @NotBlank String name, @NotNull PartyType type,
                       String phone, String email, String region, String address, String country, String port,
                       BigDecimal creditLimit, @Min(0) Integer paymentTermsDays, PartyStatus status,
                       Long agentId, String agentName) {
    public static PartyDto from(Party p) {
        Party a = p.getAgent();
        return new PartyDto(p.getId(), p.getCode(), p.getName(), p.getType(), p.getPhone(), p.getEmail(),
                p.getRegion(), p.getAddress(), p.getCountry(), p.getPort(), p.getCreditLimit(),
                p.getPaymentTermsDays(), p.getStatus(), a == null ? null : a.getId(), a == null ? null : a.getName());
    }
}
