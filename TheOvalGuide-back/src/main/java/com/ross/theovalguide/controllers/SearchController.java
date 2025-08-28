package com.ross.theovalguide.controllers;

import com.ross.theovalguide.DTOS.search.SearchResponse;
import com.ross.theovalguide.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    // Public fallback
    @GetMapping("/search")
    public ResponseEntity<SearchResponse> search(@RequestParam("q") String q,
                                                 @RequestParam(value = "limit", defaultValue = "10") int limit) {
        var trimmed = q == null ? "" : q.trim();
        if (trimmed.length() < 3) {
            return ResponseEntity.ok(new SearchResponse(java.util.List.of()));
        }
        return ResponseEntity.ok(searchService.search(trimmed, limit));
    }

    ///  Auth variant  maybe set up later
    @GetMapping("/auth/search")
    public ResponseEntity<SearchResponse> authSearch(@RequestParam("q") String q,
                                                     @RequestParam(value = "limit", defaultValue = "10") int limit) {
        return search(q, limit);
    }
}