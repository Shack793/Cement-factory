package com.cementfactory.repository;

import com.cementfactory.model.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StoreRepository extends JpaRepository<Store, Long> {
    boolean existsByCode(String code);
    Optional<Store> findByCode(String code);
}
