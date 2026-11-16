package com.frescor.controller;

import com.frescor.dto.CategoryDto;
import com.frescor.dto.PageResponse;
import com.frescor.dto.ProductDto;
import com.frescor.service.ProductService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) { this.service = service; }

    @GetMapping("/products")
    public PageResponse<ProductDto> list(@RequestParam(required = false) Long categoryId,
                                         @RequestParam(required = false) String q,
                                         @RequestParam(defaultValue = "false") boolean onSale,
                                         @RequestParam(defaultValue = "default") String sort,
                                         @RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "12") int size) {
        return service.search(categoryId, q, onSale, sort, page, size);
    }

    @GetMapping("/products/{id}")
    public ProductDto get(@PathVariable Long id) { return service.get(id); }

    @GetMapping("/categories")
    public List<CategoryDto> categories() { return service.categories(); }
}
