package com.frescor.controller;

import com.frescor.dto.CreateOrderRequest;
import com.frescor.dto.OrderDto;
import com.frescor.security.AuthUser;
import com.frescor.service.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** Todos los endpoints de pedidos exigen haber iniciado sesión. */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService service;

    public OrderController(OrderService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDto create(@Valid @RequestBody CreateOrderRequest request,
                           @AuthenticationPrincipal AuthUser user) {
        return service.create(request, user.id());
    }

    /** Historial de pedidos del usuario ("Mis pedidos"). */
    @GetMapping
    public List<OrderDto> mine(@AuthenticationPrincipal AuthUser user) {
        return service.findMine(user.id());
    }

    @GetMapping("/{id}")
    public OrderDto get(@PathVariable Long id, @AuthenticationPrincipal AuthUser user) {
        return service.getMine(id, user.id());
    }
}
