package com.cementfactory.exception;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String what, Object id) { super(what + " not found: " + id); }
}
