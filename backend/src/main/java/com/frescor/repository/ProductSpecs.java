package com.frescor.repository;

import com.frescor.model.Product;
import jakarta.persistence.criteria.Predicate;
import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

/** Filtros combinables del catálogo (compatibles con H2 y PostgreSQL). */
public final class ProductSpecs {
    private ProductSpecs() {}

    public static Specification<Product> inCategory(Long categoryId) {
        return (root, query, cb) -> cb.equal(root.get("category").get("id"), categoryId);
    }

    /**
     * Cada palabra escrita debe aparecer en el producto. Ignora mayúsculas y tildes
     * y tolera plurales sencillos ("tomates" encuentra "Tomate rama").
     */
    public static Specification<Product> matches(String text) {
        return (root, query, cb) -> {
            List<Predicate> parts = new ArrayList<>();
            for (String word : normalize(text).split("\\s+")) {
                if (word.isBlank()) continue;
                if (word.length() > 3 && word.endsWith("es")) word = word.substring(0, word.length() - 2);
                else if (word.length() > 3 && word.endsWith("s")) word = word.substring(0, word.length() - 1);
                parts.add(cb.like(root.get("searchText"), "%" + word + "%"));
            }
            return cb.and(parts.toArray(new Predicate[0]));
        };
    }

    public static Specification<Product> onSale() {
        return (root, query, cb) -> cb.isNotNull(root.get("salePrice"));
    }

    public static String normalize(String s) {
        return Normalizer.normalize(s == null ? "" : s, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "").toLowerCase().trim();
    }
}
