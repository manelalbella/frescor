package com.frescor.dto;

import com.frescor.model.CustomerOrder;
import com.frescor.model.OrderItem;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderDto(Long id, String status, String customerName, String customerEmail,
                       String address, String city, String postalCode,
                       BigDecimal subtotal, BigDecimal shipping, BigDecimal total,
                       Instant createdAt, List<Line> items) {

    public record Line(Long productId, String name, String emoji, BigDecimal unitPrice,
                       int quantity, BigDecimal lineTotal) {
        static Line from(OrderItem i) {
            return new Line(i.getProductId(), i.getProductName(), i.getEmoji(),
                    i.getUnitPrice(), i.getQuantity(), i.getLineTotal());
        }
    }

    public static OrderDto from(CustomerOrder o) {
        return new OrderDto(o.getId(), o.getStatus().name(), o.getCustomerName(), o.getCustomerEmail(),
                o.getAddress(), o.getCity(), o.getPostalCode(),
                o.getSubtotal(), o.getShipping(), o.getTotal(), o.getCreatedAt(),
                o.getItems().stream().map(Line::from).toList());
    }
}
