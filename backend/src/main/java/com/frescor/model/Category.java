package com.frescor.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    private String emoji;

    protected Category() {}

    public Category(String name, String slug, String emoji) {
        this.name = name;
        this.slug = slug;
        this.emoji = emoji;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getSlug() { return slug; }
    public String getEmoji() { return emoji; }
}
