package com.cementfactory.repository;

import com.cementfactory.model.Party;
import com.cementfactory.model.PartyType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PartyRepository extends JpaRepository<Party, Long> {
    boolean existsByCode(String code);
    List<Party> findByTypeOrderByNameAsc(PartyType type);
}
