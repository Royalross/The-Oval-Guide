package com.ross.theovalguide.DTOS.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank
        @Size(max = 255)
        String login,
        @NotBlank
        @Size(min = 1, max = 255)
        String password
) {
}
