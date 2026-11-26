package com.cementfactory.repository;

import com.cementfactory.model.MovementStatus;
import com.cementfactory.model.StockMovement;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    @Query("select m.store.id as storeId, m.item.id as itemId, sum(m.quantity) as quantity "
            + "from StockMovement m where m.status = :status group by m.store.id, m.item.id")
    List<BalanceRow> balances(@Param("status") MovementStatus status);

    @Query("select coalesce(sum(m.quantity), 0) from StockMovement m "
            + "where m.store.id = :storeId and m.item.id = :itemId and m.status = :status")
    BigDecimal balance(@Param("storeId") Long storeId, @Param("itemId") Long itemId, @Param("status") MovementStatus status);

    @Query("select m from StockMovement m order by m.id desc")
    List<StockMovement> recent(Pageable pageable);

    @Query("select m from StockMovement m where m.store.id = :storeId order by m.id desc")
    List<StockMovement> recentForStore(@Param("storeId") Long storeId, Pageable pageable);

    List<StockMovement> findByStatusOrderByIdDesc(MovementStatus status);
}
