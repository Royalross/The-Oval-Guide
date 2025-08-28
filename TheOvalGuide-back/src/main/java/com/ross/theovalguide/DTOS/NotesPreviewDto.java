package com.ross.theovalguide.DTOS;

import java.util.List;

public record NotesPreviewDto(
        int count,
        List<Sample> samples
) {
    public record Sample(String id, String title) {
    }
}