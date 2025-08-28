package com.ross.theovalguide.DTOS;

import java.math.BigDecimal;

public record ClassProfessorBriefDto(
        String id,
        String name,
        BigDecimal overall
) {
}