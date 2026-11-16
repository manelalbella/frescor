package com.frescor.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Indica tu email") String email,
        @NotBlank(message = "Indica tu contraseña") String password) {}
