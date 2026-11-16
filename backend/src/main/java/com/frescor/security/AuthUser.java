package com.frescor.security;

/** Usuario autenticado en la petición actual (lo que se guarda en el contexto de seguridad). */
public record AuthUser(Long id, String name, String email) {}
