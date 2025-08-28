package com.ross.theovalguide.bootstrap;

import com.ross.theovalguide.repo.ProfessorRepository;
import com.ross.theovalguide.service.SlugService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class SlugBackfillRunner implements CommandLineRunner {
    private final ProfessorRepository professorRepo;
    private final SlugService slugs;

    @Override
    @Transactional
    public void run(String... args) {
        professorRepo.findAll().forEach(p -> {
            if (p.getSlug() == null || p.getSlug().isBlank()) {
                p.setSlug(slugs.uniqueProfessorSlug(p.getName()));
                professorRepo.save(p);
            }
        });
    }
}