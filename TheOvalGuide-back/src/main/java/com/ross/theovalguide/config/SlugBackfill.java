package com.ross.theovalguide.config;

import com.ross.theovalguide.model.Professor;
import com.ross.theovalguide.repo.ProfessorRepository;
import com.ross.theovalguide.service.SlugService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Configuration
@RequiredArgsConstructor
public class SlugBackfill {
    private final ProfessorRepository profRepo;
    private final SlugService slugs;

    @Bean
    ApplicationRunner backfillProfessorSlugs() {
        return args -> run();
    }

    @Transactional
    public void run() {
        var dirty = new ArrayList<Professor>();
        for (var p : profRepo.findAll()) {
            if (p.getSlug() == null || p.getSlug().isBlank()) {
                p.setSlug(slugs.uniqueProfessorSlug(p.getName()));
                dirty.add(p);
            }
        }
        if (!dirty.isEmpty()) profRepo.saveAll(dirty);
    }
}