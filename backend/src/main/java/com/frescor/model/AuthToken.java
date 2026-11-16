package com.frescor.model;

import jakarta.persistence.*;
import java.time.Instant;

/** Sesión iniciada. Se guarda el hash SHA-256 del token, nunca el token en claro. */
@Entity
@Table(name = "auth_tokens")
public class AuthToken {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 64)
    private String tokenHash;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private AppUser user;

    @Column(nullable = false)
    private Instant expiresAt;

    protected AuthToken() {}

    public AuthToken(String tokenHash, AppUser user, Instant expiresAt) {
        this.tokenHash = tokenHash;
        this.user = user;
        this.expiresAt = expiresAt;
    }

    public String getTokenHash() { return tokenHash; }
    public AppUser getUser() { return user; }
    public Instant getExpiresAt() { return expiresAt; }
}
