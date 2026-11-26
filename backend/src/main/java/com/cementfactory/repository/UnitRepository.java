package com.cementfactory.repository;

import com.cementfactory.model.UnitOfMeasure;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UnitRepository extends JpaRepository<UnitOfMeasure, Long> {
    Optional<UnitOfMeasure> findByCode(String code);
    boolean existsByCode(String code);
}
