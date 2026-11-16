package com.frescor.security;

/** Extrae el token de una cabecera "Authorization: Bearer <token>". */
public final class BearerToken {
    private static final String PREFIX = "Bearer ";

    private BearerToken() {}

    /** @return el token, o null si la cabecera no existe o no tiene el formato esperado */
    public static String from(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith(PREFIX)) return null;
        String token = authorizationHeader.substring(PREFIX.length()).trim();
        return token.isEmpty() ? null : token;
    }
}
