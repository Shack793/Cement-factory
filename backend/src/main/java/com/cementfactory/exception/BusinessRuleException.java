package com.cementfactory.exception;

/** Thrown when a business rule from the PDF is broken (e.g. insufficient stock, order not Released). */
public class BusinessRuleException extends RuntimeException {
    public BusinessRuleException(String message) { super(message); }
}
