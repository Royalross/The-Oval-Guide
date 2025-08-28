package com.ross.theovalguide.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Check;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "reviews")
@Check(constraints = "(professor_id is not null) or (class_id is not null)")
public class Review extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)                 // optional by default
    @JoinColumn(name = "user_id", nullable = true,     // allow null in DB
            foreignKey = @ForeignKey(name = "fk_review_user"))
    private UserAccount user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "professor_id",
            foreignKey = @ForeignKey(name = "fk_review_prof"))
    private Professor professor; // nullable

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id",
            foreignKey = @ForeignKey(name = "fk_review_class"))
    private CourseClass courseClass; // nullable

    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private Integer rating;

    @Min(1)
    @Max(5)
    private Integer difficulty; // nullable

    @Column(columnDefinition = "text")
    private String comment;
}