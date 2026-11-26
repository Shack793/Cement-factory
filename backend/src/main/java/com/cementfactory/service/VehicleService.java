package com.cementfactory.service;

import com.cementfactory.dto.VehicleDto;
import com.cementfactory.exception.BusinessRuleException;
import com.cementfactory.exception.NotFoundException;
import com.cementfactory.model.Vehicle;
import com.cementfactory.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class VehicleService {
    private final VehicleRepository repo;

    public VehicleService(VehicleRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<VehicleDto> list() { return repo.findAll().stream().map(VehicleDto::from).toList(); }

    public VehicleDto create(VehicleDto d) {
        String reg = d.registration().trim().toUpperCase();
        if (repo.existsByRegistration(reg)) throw new BusinessRuleException("Vehicle already registered: " + reg);
        Vehicle v = new Vehicle();
        v.setRegistration(reg);
        apply(v, d);
        return VehicleDto.from(repo.save(v));
    }

    public VehicleDto update(Long id, VehicleDto d) {
        Vehicle v = repo.findById(id).orElseThrow(() -> new NotFoundException("Vehicle", id));
        apply(v, d);
        return VehicleDto.from(repo.save(v));
    }

    public void delete(Long id) {
        repo.delete(repo.findById(id).orElseThrow(() -> new NotFoundException("Vehicle", id)));
    }

    private void apply(Vehicle v, VehicleDto d) {
        v.setStoredTareKg(d.storedTareKg());
        v.setCapacityKg(d.capacityKg());
        v.setGrossLimitKg(d.grossLimitKg());
        v.setOwnerName(d.ownerName());
        v.setActive(d.active() == null || d.active());
    }
}
