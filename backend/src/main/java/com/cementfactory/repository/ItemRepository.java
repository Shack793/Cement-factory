package com.cementfactory.repository;

import com.cementfactory.model.Item;
import com.cementfactory.model.ItemType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {
    boolean existsByCode(String code);
    List<Item> findByTypeOrderByCodeAsc(ItemType type);
}
