package com.ross.theovalguide.controllers;

import com.ross.theovalguide.DTOS.ClassResponse;
import com.ross.theovalguide.service.ClassQueryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ClassController {
    private final ClassQueryService service;

    /// GET /api/classes/{code}
    @GetMapping("/classes/{code}")
    public ResponseEntity<ClassResponse> getOneByCode(@PathVariable String code) {
        return ResponseEntity.ok(service.getClassByCode(code));
    }
}