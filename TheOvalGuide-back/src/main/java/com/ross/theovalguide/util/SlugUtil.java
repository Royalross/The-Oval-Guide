package com.ross.theovalguide.util;

public final class SlugUtil {
    private SlugUtil() {
    }

    public static String toSlug(String s) {
        if (s == null) return null;
        String out = s.trim().toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-+|-+$)", "");
        return out.isBlank() ? null : out;
    }

    /**
     * Optional: strip common academic titles from the head of a name
     */
    public static String stripTitlePrefix(String s) {
        if (s == null) return null;
        return s.replaceFirst("(?i)^(dr\\.?|prof\\.?|professor)\\s+", "").trim();
    }
}