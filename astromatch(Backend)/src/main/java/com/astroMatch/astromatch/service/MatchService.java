package com.astroMatch.astromatch.service;

import com.astroMatch.astromatch.model.MatchModel;
import com.astroMatch.astromatch.model.UserModel;
import com.astroMatch.astromatch.repository.MatchRepository;
import com.astroMatch.astromatch.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MatchService {

    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    public MatchService(MatchRepository matchRepository, UserRepository userRepository) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
    }

    public String createMatch(Long userId1, Long userId2) {
        UserModel user1 = userRepository.findById(userId1)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        UserModel user2 = userRepository.findById(userId2)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Buscar si el otro usuario ya ha dado like a este usuario
        Optional<MatchModel> existingMatch = matchRepository.findByUser1AndUser2(user2, user1);

        if (existingMatch.isPresent()) {
            // Si el otro usuario ya lo había seleccionado, actualizamos a match mutuo
            MatchModel match = existingMatch.get();
            match.setMatched(true);
            matchRepository.save(match);
            return "¡Match mutuo confirmado! Ahora pueden enviarse mensajes.";
        } else {
            // Si aún no hay match mutuo, registramos la intención de este usuario
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

        Optional<MatchModel> match1 = matchRepository.findByUser1AndUser2(user1, user2);
        Optional<MatchModel> match2 = matchRepository.findByUser1AndUser2(user2, user1);

        return match1.isPresent() && match2.isPresent() && match1.get().isMatched();
    }
}
