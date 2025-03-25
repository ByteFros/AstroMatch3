package com.astroMatch.astromatch.controller;

import com.astroMatch.astromatch.model.UserModel;
import com.astroMatch.astromatch.repository.UserRepository;
import com.astroMatch.astromatch.service.MatchService;
import com.astroMatch.astromatch.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users/matches")
public class MatchController {

    private final MatchService matchService;
    private final UserRepository userRepository;
    private final UserService userService;

    // Constructor actualizado
    public MatchController(MatchService matchService,
                           UserRepository userRepository,
                           UserService userService) {
        this.matchService = matchService;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    // Metodo Matches para recoger las funcionalidades
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getUserMatches(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "80") int minCompatibility) {

        Optional<UserModel> user = userRepository.findByUsername(userDetails.getUsername());

        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        String userSign = user.get().getZodiacSign();
        String preferredGender = user.get().getPreferredGender();

        List<Map<String, Object>> matches = userService.findMatchesByZodiac(userSign, minCompatibility, preferredGender);
        return ResponseEntity.ok(matches);
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
