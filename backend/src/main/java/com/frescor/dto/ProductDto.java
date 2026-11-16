package com.frescor.dto;

import com.frescor.model.Product;
import java.math.BigDecimal;

public record ProductDto(Long id, String name, String description, String unit,
                         BigDecimal price, BigDecimal salePrice, BigDecimal currentPrice,
                         int stock, String emoji, CategoryDto category) {
    public static ProductDto from(Product p) {
        return new ProductDto(p.getId(), p.getName(), p.getDescription(), p.getUnit(),
                p.getPrice(), p.getSalePrice(), p.getCurrentPrice(),
                p.getStock(), p.getEmoji(), CategoryDto.from(p.getCategory()));
    }
}
