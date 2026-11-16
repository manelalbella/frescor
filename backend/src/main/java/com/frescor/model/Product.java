package com.frescor.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "products", indexes = @Index(columnList = "name"))
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    /** Formato de venta: "1 kg", "Pack 6 uds", "1 L"... */
    private String unit;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /** Si no es null, el producto está en oferta con este precio. */
    @Column(precision = 10, scale = 2)
    private BigDecimal salePrice;

    @Column(nullable = false)
    private int stock;

    private String emoji;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    private Category category;

    /** Nombre + categoría + descripción en minúsculas y sin tildes, para buscar. */
    @Column(length = 1200)
    private String searchText;

    protected Product() {}

    public Product(String name, String description, String unit, BigDecimal price,
                   BigDecimal salePrice, int stock, String emoji, Category category) {
        this.name = name;
        this.description = description;
        this.unit = unit;
        this.price = price;
        this.salePrice = salePrice;
        this.stock = stock;
        this.emoji = emoji;
        this.category = category;
    }

    @PrePersist
    @PreUpdate
    void updateSearchText() {
        this.searchText = com.frescor.repository.ProductSpecs.normalize(
                name + " " + (category != null ? category.getName() : "") + " " + (description != null ? description : ""));
    }

    /** Precio que realmente paga el cliente. */
    public BigDecimal getCurrentPrice() {
        return salePrice != null ? salePrice : price;
    }

    public void decreaseStock(int quantity) { this.stock -= quantity; }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getUnit() { return unit; }
    public BigDecimal getPrice() { return price; }
    public BigDecimal getSalePrice() { return salePrice; }
    public int getStock() { return stock; }
    public String getEmoji() { return emoji; }
    public Category getCategory() { return category; }
}
