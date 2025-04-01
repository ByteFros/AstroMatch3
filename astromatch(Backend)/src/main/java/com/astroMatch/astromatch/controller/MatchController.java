// File: MatchController.java
package com.astroMatch.astromatch.controller;

import com.astroMatch.astromatch.dto.PendingLikeDTO;
import com.astroMatch.astromatch.dto.UserMatchDTO;
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
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;
    private final UserRepository userRepository;
    private final UserService userService;

    public MatchController(MatchService matchService,
                           UserRepository userRepository,
                           UserService userService) {
        this.matchService = matchService;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserMatchDTO>> getUserMatches(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "20") int minCompatibility) {

        Optional<UserModel> user = userRepository.findByUsername(userDetails.getUsername());

        if (user.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        List<UserMatchDTO> matches = matchService.getCompatibleMatches(user.get(), minCompatibility);
        return ResponseEntity.ok(matches);
    }

    @PostMapping("/{targetUserId}")
    public ResponseEntity<Map<String, String>> createMatch(@AuthenticationPrincipal UserDetails userDetails,
                                                           @PathVariable Long targetUserId) {
        Optional<UserModel> sourceUser = userRepository.findByUsername(userDetails.getUsername());

        if (sourceUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String message = matchService.createMatch(sourceUser.get().getId(), targetUserId);
        return ResponseEntity.ok(Map.of("message", message));
    }

    @GetMapping("/check/{userId1}/{userId2}")
    public ResponseEntity<Map<String, Boolean>> checkMatch(@PathVariable Long userId1, @PathVariable Long userId2) {
        boolean isMutual = matchService.isMutualMatch(userId1, userId2);
        return ResponseEntity.ok(Map.of("match", isMutual));
    }

    @GetMapping("/pending-likes")
    public ResponseEntity<List<PendingLikeDTO>> getPendingLikes(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<UserModel> userOpt = userRepository.findByUsername(userDetails.getUsername());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = userOpt.get().getId();
        List<PendingLikeDTO> pendingLikes = matchService.getPendingLikes(userId);
        return ResponseEntity.ok(pendingLikes);
    }

    @GetMapping("/mutual")
    public ResponseEntity<List<UserMatchDTO>> getMutualMatches(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<UserModel> userOpt = userRepository.findByUsername(userDetails.getUsername());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<UserMatchDTO> mutuals = matchService.getMutualMatches(userOpt.get());
        return ResponseEntity.ok(mutuals);
    }

    @PostMapping("/dislike/{targetUserId}")
    public ResponseEntity<Void> dislikeUser(@AuthenticationPrincipal UserDetails userDetails,
                                            @PathVariable Long targetUserId) {
        Optional<UserModel> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        matchService.dislikeUser(userOpt.get().getId(), targetUserId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/likes")
    public ResponseEntity<List<UserMatchDTO>> getAllLikedUsers(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<UserModel> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<UserMatchDTO> likedUsers = matchService.getAllLikedUsers(userOpt.get());
        return ResponseEntity.ok(likedUsers);
    }

}