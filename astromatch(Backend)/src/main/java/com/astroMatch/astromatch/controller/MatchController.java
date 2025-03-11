package com.astroMatch.astromatch.controller;

import com.astroMatch.astromatch.service.MatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @PostMapping("/{userId1}/{userId2}")
    public ResponseEntity<Map<String, String>> createMatch(@PathVariable Long userId1, @PathVariable Long userId2) {
        String message = matchService.createMatch(userId1, userId2);
        return ResponseEntity.ok(Map.of("message", message));
    }

    @GetMapping("/check/{userId1}/{userId2}")
    public ResponseEntity<Map<String, Boolean>> checkMatch(@PathVariable Long userId1, @PathVariable Long userId2) {
        boolean isMutual = matchService.isMutualMatch(userId1, userId2);
        return ResponseEntity.ok(Map.of("match", isMutual));
    }
}
