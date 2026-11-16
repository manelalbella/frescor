package com.frescor.dto;

import com.frescor.model.AppUser;

public record UserDto(Long id, String name, String email) {
    public static UserDto from(AppUser user) {
        return new UserDto(user.getId(), user.getName(), user.getEmail());
    }
}
