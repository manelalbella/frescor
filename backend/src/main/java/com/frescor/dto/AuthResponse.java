package com.frescor.dto;

/** Respuesta de registro e inicio de sesión: el token se guarda en el navegador. */
public record AuthResponse(String token, UserDto user) {}
