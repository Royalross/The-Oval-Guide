package com.ross.theovalguide.DTOS.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank
        @Size(min = 3, max = 32)
        @Pattern(regexp = "^[a-zA-Z0-9._-]+$", message = "Username may only contain letters, numbers, dots, underscores, and hyphens")
        String username,
        @NotBlank
        @Email
        @Size(max = 255)
        String email,
        @NotBlank
        @Email
        @Size(max = 255)
        @Pattern(regexp = ".*\\.edu$", message = "School email must end with .edu")
        String schoolEmail,
        @NotBlank
        @Size(min = 8, max = 255)
        String password
) {
}
