package com.ross.theovalguide.DTOS.search;

public record SearchItem(
        String kind,      // "professor" | "class"
        String id,        // <-- SLUG for professors, CODE for classes
        String title,     // display title
        String subtitle,  // secondary line
        Double overall,   // for professor
        Double difficulty // for class
) {
}