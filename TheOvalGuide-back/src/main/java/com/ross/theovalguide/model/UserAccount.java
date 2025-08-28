package com.ross.theovalguide.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Check;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_users_username", columnNames = "username"),
                @UniqueConstraint(name = "uk_users_email", columnNames = "email")
        })
@Check(constraints = "role in ('USER','ADMIN')")
public class UserAccount extends BaseEntity {

    @NotBlank
    @Size(max = 50)
    @Column(length = 50, nullable = false)
    private String username;

    @NotBlank
    @Email
    @Size(max = 255)
    @Column(length = 255, nullable = false)
    private String email;

    @NotBlank
    @Column(name = "password_hash", columnDefinition = "text", nullable = false)
    private String passwordHash;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    @Email
    @Size(max = 255)
    @Column(name = "school_email", length = 255)
    private String schoolEmail; // nullable

    @Column(name = "school_verified", nullable = false)
    private boolean schoolVerified = false;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private Role role = Role.USER;
}