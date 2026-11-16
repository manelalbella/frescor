package com.frescor.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private CustomerOrder order;

    private Long productId;
    private String productName;
    private String emoji;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private int quantity;

    protected OrderItem() {}

    public OrderItem(Product product, int quantity) {
        this.productId = product.getId();
        this.productName = product.getName();
        this.emoji = product.getEmoji();
        this.unitPrice = product.getCurrentPrice();   // precio "congelado" en el momento de la compra
        this.quantity = quantity;
    }

    public BigDecimal getLineTotal() { return unitPrice.multiply(BigDecimal.valueOf(quantity)); }

    void setOrder(CustomerOrder order) { this.order = order; }

    public Long getProductId() { return productId; }
    public String getProductName() { return productName; }
    public String getEmoji() { return emoji; }
    public BigDecimal getUnitPrice() { return unitPrice; }
    public int getQuantity() { return quantity; }
}
