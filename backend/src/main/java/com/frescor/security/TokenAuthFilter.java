package com.frescor.security;

import com.frescor.service.AuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Si la petición trae un token válido, deja al usuario autenticado.
 * Si no hay token (o no es válido) no hace nada: las reglas de acceso
 * decidirán después si la ruta exige estar identificado.
 *
 * Nota: NO es un @Component a propósito, para que Spring Boot no lo registre
 * dos veces; se crea dentro de SecurityConfig.
 */
public class TokenAuthFilter extends OncePerRequestFilter {

    private final AuthService authService;

    public TokenAuthFilter(AuthService authService) {
        this.authService = authService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String token = BearerToken.from(request.getHeader(HttpHeaders.AUTHORIZATION));
        if (token != null) {
            authService.authenticate(token).ifPresent(user -> {
                var authentication = new UsernamePasswordAuthenticationToken(user, null, List.of());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            });
        }
        chain.doFilter(request, response);
    }
}
