package com.cementfactory.service;

import com.cementfactory.dto.ConversionDto;
import com.cementfactory.dto.UnitDto;
import com.cementfactory.exception.BusinessRuleException;
import com.cementfactory.exception.NotFoundException;
import com.cementfactory.model.UnitOfMeasure;
import com.cementfactory.repository.UnitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@Transactional
public class UnitService {
    private final UnitRepository repo;

    public UnitService(UnitRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<UnitDto> list() { return repo.findAll().stream().map(UnitDto::from).toList(); }

    public UnitDto create(UnitDto d) {
        String code = d.code().trim().toUpperCase();
        if (repo.existsByCode(code)) throw new BusinessRuleException("Unit code already exists: " + code);
        UnitOfMeasure u = new UnitOfMeasure();
        u.setCode(code);
        u.setName(d.name());
        u.setKgFactor(d.kgFactor());
        return UnitDto.from(repo.save(u));
    }

    /** Convert a quantity between two units using their kg factors (e.g. 40 BAG to 2 MT). */
    @Transactional(readOnly = true)
    public ConversionDto convert(String from, String to, BigDecimal qty) {
        UnitOfMeasure f = repo.findByCode(from.toUpperCase()).orElseThrow(() -> new NotFoundException("Unit", from));
        UnitOfMeasure t = repo.findByCode(to.toUpperCase()).orElseThrow(() -> new NotFoundException("Unit", to));
        BigDecimal kg = qty.multiply(f.getKgFactor());
        BigDecimal result = kg.divide(t.getKgFactor(), 4, RoundingMode.HALF_UP).stripTrailingZeros();
        if (result.scale() < 0) result = result.setScale(0); // avoid 4E+1 style output
        return new ConversionDto(f.getCode(), t.getCode(), qty, result);
    }
}
