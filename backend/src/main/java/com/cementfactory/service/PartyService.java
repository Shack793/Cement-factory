package com.cementfactory.service;

import com.cementfactory.dto.PartyDto;
import com.cementfactory.exception.BusinessRuleException;
import com.cementfactory.exception.NotFoundException;
import com.cementfactory.model.Party;
import com.cementfactory.model.PartyStatus;
import com.cementfactory.model.PartyType;
import com.cementfactory.repository.PartyRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class PartyService {
    private final PartyRepository repo;

    public PartyService(PartyRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<PartyDto> list(PartyType type) {
        List<Party> ps = type == null ? repo.findAll() : repo.findByTypeOrderByNameAsc(type);
        return ps.stream().map(PartyDto::from).toList();
    }

    @Transactional(readOnly = true)
    public PartyDto get(Long id) { return PartyDto.from(find(id)); }

    public PartyDto create(PartyDto d) {
        String code = d.code().trim().toUpperCase();
        if (repo.existsByCode(code)) throw new BusinessRuleException("Party code already exists: " + code);
        Party p = new Party();
        p.setCode(code);
        apply(p, d);
        return PartyDto.from(repo.save(p));
    }

    public PartyDto update(Long id, PartyDto d) {
        Party p = find(id);
        apply(p, d);
        return PartyDto.from(repo.save(p));
    }

    /** Active, On hold or Blocked (PDF 7.2). Blocked accounts cannot have orders approved. */
    public PartyDto setStatus(Long id, PartyStatus status) {
        Party p = find(id);
        p.setStatus(status);
        return PartyDto.from(repo.save(p));
    }

    public void delete(Long id) { repo.delete(find(id)); }

    private void apply(Party p, PartyDto d) {
        p.setName(d.name());
        p.setType(d.type());
        p.setPhone(d.phone());
        p.setEmail(d.email());
        p.setRegion(d.region());
        p.setAddress(d.address());
        p.setCountry(d.country());
        p.setPort(d.port());
        p.setCreditLimit(d.creditLimit() == null ? BigDecimal.ZERO : d.creditLimit());
        p.setPaymentTermsDays(d.paymentTermsDays() == null ? 0 : d.paymentTermsDays());
        p.setStatus(d.status() == null ? PartyStatus.ACTIVE : d.status());
        p.setAgent(d.agentId() == null ? null : find(d.agentId()));
    }

    private Party find(Long id) { return repo.findById(id).orElseThrow(() -> new NotFoundException("Party", id)); }
}
