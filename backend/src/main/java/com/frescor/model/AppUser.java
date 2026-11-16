package com.frescor.model;

import jakarta.persistence.*;
import java.time.Instant;

/** Cuenta de cliente. La tabla se llama "users" (USER es palabra reservada en PostgreSQL). */
@Entity
@Table(name = "users")
public class AppUser {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    /** Hash BCrypt: la contraseña nunca se guarda en claro. */
    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    protected AppUser() {}

    public AppUser(String name, String email, String passwordHash) {
        this.name = name;
        this.email = email;
        this.passwordHash = passwordHash;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public Instant getCreatedAt() { return createdAt; }
}
