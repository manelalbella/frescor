package com.frescor.service;

import com.frescor.dto.AuthResponse;
import com.frescor.dto.LoginRequest;
import com.frescor.dto.RegisterRequest;
import com.frescor.dto.UserDto;
import com.frescor.exception.EmailAlreadyUsedException;
import com.frescor.exception.InvalidCredentialsException;
import com.frescor.model.AppUser;
import com.frescor.model.AuthToken;
import com.frescor.repository.AuthTokenRepository;
import com.frescor.repository.UserRepository;
import com.frescor.security.AuthUser;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Registro, inicio y cierre de sesión.
 * Las sesiones son tokens aleatorios guardados (como hash) en la base de datos,
 * así que cerrar sesión los invalida de verdad en el servidor.
 */
@Service
public class AuthService {

    private final UserRepository users;
    private final AuthTokenRepository tokens;
    private final PasswordEncoder encoder;
    private final Duration tokenLifetime;
    private final SecureRandom random = new SecureRandom();

    public AuthService(UserRepository users, AuthTokenRepository tokens, PasswordEncoder encoder,
                       @Value("${app.auth.token-days}") long tokenDays) {
        this.users = users;
        this.tokens = tokens;
        this.encoder = encoder;
        this.tokenLifetime = Duration.ofDays(tokenDays);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        if (users.existsByEmail(email)) throw new EmailAlreadyUsedException();

        AppUser user = users.save(new AppUser(request.name().trim(), email, encoder.encode(request.password())));
        return startSession(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Mismo error si el email no existe o la contraseña falla: no revela qué cuentas existen
        AppUser user = users.findByEmail(normalizeEmail(request.email()))
                .filter(u -> encoder.matches(request.password(), u.getPasswordHash()))
                .orElseThrow(InvalidCredentialsException::new);

        tokens.deleteByExpiresAtBefore(Instant.now());   // limpieza de sesiones caducadas
        return startSession(user);
    }

    @Transactional
    public void logout(String rawToken) {
        tokens.deleteByTokenHash(hash(rawToken));
    }

    @Transactional(readOnly = true)
    public Optional<AuthUser> authenticate(String rawToken) {
        return tokens.findByTokenHash(hash(rawToken))
                .filter(token -> token.getExpiresAt().isAfter(Instant.now()))
                .map(token -> {
                    AppUser user = token.getUser();
                    return new AuthUser(user.getId(), user.getName(), user.getEmail());
                });
    }

    // ---------- helpers ----------

    private AuthResponse startSession(AppUser user) {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        tokens.save(new AuthToken(hash(rawToken), user, Instant.now().plus(tokenLifetime)));
        return new AuthResponse(rawToken, UserDto.from(user));
    }

    private static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static String hash(String rawToken) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 no disponible", e);
        }
    }
}
