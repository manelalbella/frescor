package com.frescor.dto;

import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank(message = "Indica tu nombre") @Size(max = 80, message = "El nombre es demasiado largo") String name,
        @NotBlank(message = "Indica tu email") @Email(message = "El email no es válido") String email,
        @NotBlank(message = "Elige una contraseña")
        @Size(min = 8, max = 72, message = "La contraseña debe tener entre 8 y 72 caracteres") String password) {}
