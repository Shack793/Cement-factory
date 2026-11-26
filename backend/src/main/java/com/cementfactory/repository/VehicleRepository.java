package com.cementfactory.repository;

import com.cementfactory.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    boolean existsByRegistration(String registration);
    Optional<Vehicle> findByRegistration(String registration);
}
