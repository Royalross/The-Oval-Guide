package com.ross.theovalguide.service;

import com.ross.theovalguide.repo.ProfessorRepository;
import com.ross.theovalguide.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SlugService {
    private final ProfessorRepository professorRepo;

    public String uniqueProfessorSlug(String rawName) {
        String base = SlugUtil.toSlug(SlugUtil.stripTitlePrefix(rawName));
        if (base == null) base = "professor";
        String s = base;
        int i = 2;
        while (professorRepo.existsBySlugIgnoreCase(s)) {
            s = base + "-" + i++;
        }
        return s;
    }
}