package com.cementfactory.service;

import com.cementfactory.dto.DriverDto;
import com.cementfactory.exception.NotFoundException;
import com.cementfactory.model.Driver;
import com.cementfactory.repository.DriverRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class DriverService {
    private final DriverRepository repo;

    public DriverService(DriverRepository repo) { this.repo = repo; }

    @Transactional(readOnly = true)
    public List<DriverDto> list() { return repo.findAll().stream().map(DriverDto::from).toList(); }

    public DriverDto create(DriverDto d) {
        Driver x = new Driver();
        apply(x, d);
        return DriverDto.from(repo.save(x));
    }

    public DriverDto update(Long id, DriverDto d) {
        Driver x = repo.findById(id).orElseThrow(() -> new NotFoundException("Driver", id));
        apply(x, d);
        return DriverDto.from(repo.save(x));
    }

    public void delete(Long id) {
        repo.delete(repo.findById(id).orElseThrow(() -> new NotFoundException("Driver", id)));
    }

    private void apply(Driver x, DriverDto d) {
        x.setName(d.name());
        x.setLicenseNo(d.licenseNo());
        x.setPhone(d.phone());
        x.setIdNumber(d.idNumber());
        x.setActive(d.active() == null || d.active());
    }
}
