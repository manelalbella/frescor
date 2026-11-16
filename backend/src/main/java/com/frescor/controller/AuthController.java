package com.frescor.controller;

import com.frescor.dto.AuthResponse;
import com.frescor.dto.LoginRequest;
import com.frescor.dto.RegisterRequest;
import com.frescor.dto.UserDto;
import com.frescor.security.AuthUser;
import com.frescor.security.BearerToken;
import com.frescor.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) { this.service = service; }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return service.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return service.login(request);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorization) {
        String token = BearerToken.from(authorization);
        if (token != null) service.logout(token);
    }

    /** Devuelve la cuenta del token actual (el front lo usa al recargar la página). */
    @GetMapping("/me")
    public UserDto me(@AuthenticationPrincipal AuthUser user) {
        return new UserDto(user.id(), user.name(), user.email());
    }
}
