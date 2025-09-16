package com.ross.theovalguide.DTOS;

import java.math.BigDecimal;

public record ClassProfessorBriefDto(
        String id,
        String slug,
        String name,
        BigDecimal overall
) {
}