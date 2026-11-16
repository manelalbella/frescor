package com.frescor.exception;

public class EmailAlreadyUsedException extends RuntimeException {
    public EmailAlreadyUsedException() { super("Ya existe una cuenta con ese email"); }
}
