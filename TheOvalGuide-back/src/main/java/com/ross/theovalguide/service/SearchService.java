package com.ross.theovalguide.service;

import com.ross.theovalguide.DTOS.search.SearchItem;
import com.ross.theovalguide.DTOS.search.SearchResponse;
import com.ross.theovalguide.repo.CourseClassRepository;
import com.ross.theovalguide.repo.ProfessorRepository;
import com.ross.theovalguide.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final ProfessorRepository professors;
    private final CourseClassRepository classes;

    public SearchResponse search(String q, int limit) {
        // normalize
        String raw = q == null ? "" : q.trim();
        if (raw.isEmpty()) return new SearchResponse(List.of());

        String normalized = raw.replaceFirst("(?i)^(dr\\.?|prof\\.?|professor)\\s+", "").trim();
        String qNoSpace = normalized.replace(" ", "");
        String slugCand = Optional.ofNullable(SlugUtil.toSlug(normalized)).orElse(normalized);

        int cap = Math.max(1, Math.min(limit, 20));
        var page = PageRequest.of(0, cap);

        // results
        List<SearchItem> items = new ArrayList<>(cap);

        // Exact slug boost (first)
        professors.findBySlugIgnoreCase(slugCand).ifPresent(p -> items.add(new SearchItem(
                "professor",
                p.getSlug(),
                p.getName(),
                p.getDepartment() + " — " + p.getUniversity(),
                p.getOverallRating() == null ? null : p.getOverallRating().doubleValue(),
                null
        )));

        // Wide search
        var profPage = professors.searchProfessors(normalized, slugCand, page);
        var classPage = classes.searchClasses(normalized, qNoSpace, page);

        // Deduping
        var seen = new HashSet<String>();
        for (var it : List.copyOf(items)) seen.add(it.kind() + ":" + it.id());

        profPage.forEach(p -> {
            String key = "professor:" + p.getSlug();
            if (seen.add(key)) {
                items.add(new SearchItem(
                        "professor",
                        p.getSlug(),
                        p.getName(),
                        p.getDepartment() + " — " + p.getUniversity(),
                        p.getOverallRating() == null ? null : p.getOverallRating().doubleValue(),
                        null
                ));
            }
        });

        classPage.forEach(c -> {
            String key = "class:" + c.getCode();
            if (seen.add(key)) {
                items.add(new SearchItem(
                        "class",
                        c.getCode(),
                        c.getCode() + " — " + c.getTitle(),
                        c.getDepartment() + " — " + c.getUniversity(),
                        null,
                        c.getDifficultyAvg() == null ? null : c.getDifficultyAvg().doubleValue()
                ));
            }
        });

        // Return capped list without reassigning `items`
        List<SearchItem> finalItems = items.size() > cap ? items.subList(0, cap) : items;
        return new SearchResponse(finalItems);
    }
}