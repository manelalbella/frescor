package com.frescor.dto;

import com.frescor.model.Category;

public record CategoryDto(Long id, String name, String slug, String emoji) {
    public static CategoryDto from(Category c) {
        return new CategoryDto(c.getId(), c.getName(), c.getSlug(), c.getEmoji());
    }
}
