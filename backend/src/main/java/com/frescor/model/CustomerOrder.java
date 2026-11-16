package com.frescor.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class CustomerOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private String customerName;
    @Column(nullable = false) private String customerEmail;
    @Column(nullable = false) private String phone;
    @Column(nullable = false) private String address;
    @Column(nullable = false) private String city;
    @Column(nullable = false) private String postalCode;

    /** Cuenta que hizo el pedido. */
    @ManyToOne(fetch = FetchType.LAZY)
    private AppUser user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status = OrderStatus.CONFIRMED;

    @Column(nullable = false, precision = 10, scale = 2) private BigDecimal subtotal;
    @Column(nullable = false, precision = 10, scale = 2) private BigDecimal shipping;
    @Column(nullable = false, precision = 10, scale = 2) private BigDecimal total;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    protected CustomerOrder() {}

    public CustomerOrder(String customerName, String customerEmail, String phone,
                         String address, String city, String postalCode) {
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.phone = phone;
        this.address = address;
        this.city = city;
        this.postalCode = postalCode;
    }

    public void assignTo(AppUser user) { this.user = user; }

    public AppUser getUser() { return user; }

    public void addItem(OrderItem item) {
        item.setOrder(this);
        items.add(item);
    }

    public void setTotals(BigDecimal subtotal, BigDecimal shipping) {
        this.subtotal = subtotal;
        this.shipping = shipping;
        this.total = subtotal.add(shipping);
    }

    public Long getId() { return id; }
    public String getCustomerName() { return customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public String getCity() { return city; }
    public String getPostalCode() { return postalCode; }
    public OrderStatus getStatus() { return status; }
    public BigDecimal getSubtotal() { return subtotal; }
    public BigDecimal getShipping() { return shipping; }
    public BigDecimal getTotal() { return total; }
    public Instant getCreatedAt() { return createdAt; }
    public List<OrderItem> getItems() { return items; }
}
