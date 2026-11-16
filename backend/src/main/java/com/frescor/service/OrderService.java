package com.frescor.service;

import com.frescor.dto.CreateOrderRequest;
import com.frescor.dto.OrderDto;
import com.frescor.exception.InsufficientStockException;
import com.frescor.exception.ResourceNotFoundException;
import com.frescor.model.CustomerOrder;
import com.frescor.model.OrderItem;
import com.frescor.model.Product;
import com.frescor.repository.OrderRepository;
import com.frescor.repository.ProductRepository;
import com.frescor.repository.UserRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orders;
    private final ProductRepository products;
    private final UserRepository users;
    private final BigDecimal freeThreshold;
    private final BigDecimal shippingCost;

    public OrderService(OrderRepository orders, ProductRepository products, UserRepository users,
                        @Value("${app.shipping.free-threshold}") BigDecimal freeThreshold,
                        @Value("${app.shipping.cost}") BigDecimal shippingCost) {
        this.orders = orders;
        this.products = products;
        this.users = users;
        this.freeThreshold = freeThreshold;
        this.shippingCost = shippingCost;
    }

    /**
     * Crea el pedido de un usuario. Los precios SIEMPRE se calculan en el servidor
     * (nunca se confía en los importes que envía el cliente).
     */
    @Transactional
    public OrderDto create(CreateOrderRequest req, Long userId) {
        CustomerOrder order = new CustomerOrder(req.customerName(), req.customerEmail(), req.phone(),
                req.address(), req.city(), req.postalCode());
        order.assignTo(users.getReferenceById(userId));

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CreateOrderRequest.Item line : req.items()) {
            Product p = products.findById(line.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado: " + line.productId()));
            if (p.getStock() < line.quantity()) {
                throw new InsufficientStockException(
                        "No hay stock suficiente de \"" + p.getName() + "\" (quedan " + p.getStock() + ")");
            }
            p.decreaseStock(line.quantity());
            OrderItem item = new OrderItem(p, line.quantity());
            order.addItem(item);
            subtotal = subtotal.add(item.getLineTotal());
        }

        subtotal = subtotal.setScale(2, RoundingMode.HALF_UP);
        BigDecimal shipping = subtotal.compareTo(freeThreshold) >= 0 ? BigDecimal.ZERO : shippingCost;
        order.setTotals(subtotal, shipping.setScale(2, RoundingMode.HALF_UP));

        return OrderDto.from(orders.save(order));
    }

    /** Pedidos del usuario, del más reciente al más antiguo. */
    @Transactional(readOnly = true)
    public List<OrderDto> findMine(Long userId) {
        return orders.findByUserIdOrderByCreatedAtDesc(userId).stream().map(OrderDto::from).toList();
    }

    /** Un pedido solo es visible para su dueño; para el resto "no existe". */
    @Transactional(readOnly = true)
    public OrderDto getMine(Long orderId, Long userId) {
        return orders.findById(orderId)
                .filter(order -> order.getUser() != null && order.getUser().getId().equals(userId))
                .map(OrderDto::from)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado: " + orderId));
    }
}
