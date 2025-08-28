package com.ross.theovalguide.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
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
@Table(name = "classes")
public class CourseClass extends BaseEntity {


    @Column(length = 50, unique = true, nullable = false)
    private String code;

    @NotBlank
    @Size(max = 150)
    @Column(length = 150, nullable = false)
    private String title;

    @NotBlank
    @Size(max = 100)
    @Column(length = 100, nullable = false)
    private String department;

    @NotBlank
    @Size(max = 100)
    @Column(length = 100, nullable = false)
    private String university;

    // NUMERIC(3,2)
    @Column(name = "difficulty_avg", precision = 3, scale = 2)
    private BigDecimal difficultyAvg;

    @Column(name = "total_ratings", nullable = false)
    private int totalRatings = 0;
}