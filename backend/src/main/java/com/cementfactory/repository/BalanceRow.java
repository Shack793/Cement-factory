package com.cementfactory.repository;

import java.math.BigDecimal;

/** Projection for grouped ledger sums. */
public interface BalanceRow {
    Long getStoreId();
    Long getItemId();
    BigDecimal getQuantity();
}
