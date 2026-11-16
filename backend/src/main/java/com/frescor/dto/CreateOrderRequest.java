package com.frescor.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.List;

public record CreateOrderRequest(
        @NotBlank(message = "Indica tu nombre") String customerName,
        @NotBlank(message = "Indica tu email") @Email(message = "El email no es válido") String customerEmail,
        @NotBlank(message = "Indica un teléfono de contacto") String phone,
        @NotBlank(message = "Indica la dirección de entrega") String address,
        @NotBlank(message = "Indica la ciudad") String city,
        @NotBlank(message = "Indica el código postal") @Pattern(regexp = "\\d{5}", message = "El código postal debe tener 5 dígitos") String postalCode,
        @NotEmpty(message = "El carrito está vacío") @Valid List<Item> items) {

    public record Item(@NotNull Long productId, @Min(value = 1, message = "La cantidad mínima es 1") int quantity) {}
}
