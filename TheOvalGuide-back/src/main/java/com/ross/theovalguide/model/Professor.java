package com.ross.theovalguide.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "professors")
public class Professor extends BaseEntity {


    @Column(unique = true)
    private String slug;

    @NotBlank
    @Size(max = 100)
    @Column(length = 100, nullable = false)
    private String name;

    @NotBlank
    @Size(max = 100)
    @Column(length = 100, nullable = false)
    private String department;

    @NotBlank
    @Size(max = 100)
    @Column(length = 100, nullable = false)
    private String university;

    // NUMERIC(3,2)  4.32
    @Column(name = "overall_rating", precision = 3, scale = 2)
    private BigDecimal overallRating;

    @Column(name = "total_ratings", nullable = false)
    private int totalRatings = 0;

    private static String slugify(String in) {
        if (in == null) return null;
        String s = in.trim().toLowerCase();
        s = s.replaceAll("[^a-z0-9]+", "-");
        s = s.replaceAll("(^-+|-+$)", "");
        return s;
    }

    @PrePersist
    @PreUpdate
    private void ensureSlug() {
        if (this.slug == null || this.slug.isBlank()) {
            this.slug = slugify(this.name); // default only; uniqueness handled elsewhere
        }
    }
}