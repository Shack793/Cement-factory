package com.cementfactory.repository;

import com.cementfactory.model.Lot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LotRepository extends JpaRepository<Lot, Long> {
    Optional<Lot> findByCode(String code);
}
