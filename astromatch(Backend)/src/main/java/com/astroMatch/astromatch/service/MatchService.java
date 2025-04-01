// File: MatchService.java
package com.astroMatch.astromatch.service;

import com.astroMatch.astromatch.dto.PendingLikeDTO;
import com.astroMatch.astromatch.dto.UserMatchDTO;
import com.astroMatch.astromatch.model.MatchModel;
import com.astroMatch.astromatch.model.UserModel;
import com.astroMatch.astromatch.repository.MatchRepository;
import com.astroMatch.astromatch.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MatchService {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final ZodiacService zodiacService;

    public MatchService(MatchRepository matchRepository,
                        UserRepository userRepository,
                        ZodiacService zodiacService) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.zodiacService = zodiacService;
    }

    public String createMatch(Long userId1, Long userId2) {
        UserModel user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        UserModel user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Optional<MatchModel> existingMatch = matchRepository.findByUser1AndUser2(user2, user1);

        if (existingMatch.isPresent()) {
            MatchModel match = existingMatch.get();
            match.setMatched(true);
            matchRepository.save(match);
            return "¡Match mutuo confirmado! Ahora pueden enviarse mensajes.";
        } else {
            MatchModel newMatch = new MatchModel(null, user1, user2, false);
            matchRepository.save(newMatch);
            return "Se ha registrado tu interés. Esperando que el otro usuario también haga match.";
        }
    }

    public boolean isMutualMatch(Long userId1, Long userId2) {
        UserModel user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        UserModel user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return matchRepository.findByUser1AndUser2(user2, user1)
                .map(MatchModel::isMatched)
                .orElse(false);
    }


    public List<PendingLikeDTO> getPendingLikes(Long userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<MatchModel> pendingMatches = matchRepository.findByUser1AndIsMatchedFalse(user);

        return pendingMatches.stream()
                .map(match -> {
                    UserModel likedUser = match.getUser2();
                    return new PendingLikeDTO(
                            likedUser.getId(),
                            likedUser.getUsername(),
                            likedUser.getAge(),
                            likedUser.getProfileImageUrl(),
                            likedUser.getBio()
                    );
                })
                .collect(Collectors.toList());
    }

    public List<UserMatchDTO> getCompatibleMatches(UserModel currentUser, int minCompatibility) {
        String currentSign = currentUser.getZodiacSign();
        String preferredGender = currentUser.getPreferredGender();

        // IDs de usuarios que ya interactuaron (like o dislike)
        Set<Long> seenUserIds = matchRepository.findByUser1(currentUser).stream()
                .map(m -> m.getUser2().getId())
                .collect(Collectors.toSet());

        return userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .filter(user -> user.getGender().equalsIgnoreCase(preferredGender))
                .filter(user -> !seenUserIds.contains(user.getId()))
                .filter(user -> {
                    // Filtrar también si YA hay match mutuo confirmado
                    boolean match1 = matchRepository.findByUser1AndUser2(currentUser, user)
                            .map(MatchModel::isMatched).orElse(false);

                    boolean match2 = matchRepository.findByUser1AndUser2(user, currentUser)
                            .map(MatchModel::isMatched).orElse(false);

                    return !(match1 || match2); // ❌ excluir si ya hicieron match mutuo
                })
                .map(user -> {
                    int compatibility = zodiacService.getCompatibility(currentSign, user.getZodiacSign());
                    return new UserMatchDTO(
                            user.getId(),
                            user.getUsername(),
                            user.getAge(),
                            user.getProfileImageUrl(),
                            user.getBio(),
                            compatibility,
                            false
                    );
                })
                .filter(dto -> dto.getCompatibility() >= minCompatibility)
                .collect(Collectors.toList());
    }

    public List<UserMatchDTO> getMutualMatches(UserModel currentUser) {
        List<MatchModel> sentMatches = matchRepository.findByUser1AndIsMatchedFalse(currentUser);

        return sentMatches.stream()
                .map(MatchModel::getUser2)
                .map(user -> new UserMatchDTO(
                        user.getId(),
                        user.getUsername(),
                        user.getAge(),
                        user.getProfileImageUrl(),
                        user.getBio(),
                        zodiacService.getCompatibility(currentUser.getZodiacSign(), user.getZodiacSign()),
                        true
                ))
                .collect(Collectors.toList());
    }

// File: MatchService.java

    public List<UserMatchDTO> getAllLikedUsers(UserModel user) {
        List<MatchModel> likes = matchRepository.findByUser1(user);

        Set<Long> seenUserIds = new HashSet<>();

        return likes.stream()
                .filter(match -> seenUserIds.add(match.getUser2().getId())) // solo deja pasar si no se ha visto
                .map(match -> {
                    UserModel likedUser = match.getUser2();
                    int compatibility = zodiacService.getCompatibility(user.getZodiacSign(), likedUser.getZodiacSign());

                    boolean isMutual = matchRepository.findByUser1AndUser2(likedUser, user)
                            .map(MatchModel::isMatched)
                            .orElse(false);

                    return new UserMatchDTO(
                            likedUser.getId(),
                            likedUser.getUsername(),
                            likedUser.getAge(),
                            likedUser.getProfileImageUrl(),
                            likedUser.getBio(),
                            compatibility,
                            isMutual
                    );
                })
                .collect(Collectors.toList());
    }


    public void dislikeUser(Long dislikerId, Long dislikedId) {
        UserModel disliker = userRepository.findById(dislikerId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        UserModel disliked = userRepository.findById(dislikedId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Acción simbólica: En el futuro puedes guardar esto en una tabla "dislikes" o "blocked_matches"
        System.out.printf("Usuario %d ha dado dislike a %d\n", dislikerId, dislikedId);
    }

    public Optional<UserModel> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

}
