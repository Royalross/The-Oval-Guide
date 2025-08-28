package com.ross.theovalguide.controllers;

import com.ross.theovalguide.DTOS.ProfessorResponse;
import com.ross.theovalguide.service.ProfessorQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProfessorController {
    private final ProfessorQueryService service;

    /// GET /api/professors/{slug}
    @GetMapping("/professors/{slug}")
    public ResponseEntity<ProfessorResponse> getOneBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(service.getProfessorBySlug(slug));
    }
}