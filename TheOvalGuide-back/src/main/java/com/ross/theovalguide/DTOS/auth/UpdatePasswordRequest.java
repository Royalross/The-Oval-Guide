package com.ross.theovalguide.DTOS.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdatePasswordRequest(
        @NotBlank
        @Size(min = 8, max = 255)
        String password,
        @NotBlank
        String token
) {
}
