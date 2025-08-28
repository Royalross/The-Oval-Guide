package com.ross.theovalguide.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "tags",
        uniqueConstraints = @UniqueConstraint(name = "uk_tag_label", columnNames = "label"))
public class Tag extends BaseEntity {

    @NotBlank
    @Size(max = 50)
    @Column(length = 50, nullable = false)
    private String label;
}