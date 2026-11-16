package com.frescor.service;

import com.frescor.dto.CategoryDto;
import com.frescor.dto.PageResponse;
import com.frescor.dto.ProductDto;
import com.frescor.exception.ResourceNotFoundException;
import com.frescor.model.Product;
import com.frescor.repository.CategoryRepository;
import com.frescor.repository.ProductSpecs;
import com.frescor.repository.ProductRepository;
import java.util.List;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository products;
    private final CategoryRepository categories;

    public ProductService(ProductRepository products, CategoryRepository categories) {
        this.products = products;
        this.categories = categories;
    }

    public PageResponse<ProductDto> search(Long categoryId, String q, boolean onSale,
                                           String sort, int page, int size) {
        Sort order = switch (sort == null ? "" : sort) {
            case "price_asc" -> Sort.by("price").ascending();
            case "price_desc" -> Sort.by("price").descending();
            case "name" -> Sort.by("name").ascending();
            default -> Sort.by("id").ascending();
        };
        // Punto de partida: una condición que siempre se cumple (nunca null)
        Specification<Product> spec = (root, query, cb) -> cb.conjunction();
        if (categoryId != null) spec = spec.and(ProductSpecs.inCategory(categoryId));
        if (q != null && !q.isBlank()) spec = spec.and(ProductSpecs.matches(q));
        if (onSale) spec = spec.and(ProductSpecs.onSale());

        var result = products.findAll(spec,
                PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 48), order));
        return PageResponse.of(result.map(ProductDto::from));
    }

    public ProductDto get(Long id) {
        return products.findById(id).map(ProductDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + id));
    }

    public List<CategoryDto> categories() {
        return categories.findAll(Sort.by("id")).stream().map(CategoryDto::from).toList();
    }
}
