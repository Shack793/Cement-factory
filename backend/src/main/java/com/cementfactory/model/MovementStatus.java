package com.cementfactory.model;

/** Adjustments above the approval limit wait as PENDING and do not change stock until approved (PDF 4.2). */
public enum MovementStatus { POSTED, PENDING, REJECTED }
