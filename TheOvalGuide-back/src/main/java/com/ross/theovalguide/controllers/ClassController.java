package com.ross.theovalguide.controllers;

import com.ross.theovalguide.DTOS.ClassResponse;
import com.ross.theovalguide.DTOS.SummaryResponse;
import com.ross.theovalguide.service.ClassQueryService;
import com.ross.theovalguide.service.SummaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ClassController {
    private final ClassQueryService service;
    private final SummaryService summaryService;

    /// GET /api/classes/{code}
    @GetMapping("/classes/{code}")
    public ResponseEntity<ClassResponse> getOneByCode(@PathVariable String code) {
        return ResponseEntity.ok(service.getClassByCode(code));
    }

    /// POST /api/classes/{code}/summary
    @PostMapping("/classes/{code}/summary")
    public ResponseEntity<SummaryResponse> summarizeClass(@PathVariable String code) {
        return ResponseEntity.ok(summaryService.summarizeClass(code));
    }
}