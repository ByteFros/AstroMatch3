package com.astroMatch.astromatch.service;

import com.astroMatch.astromatch.model.MatchModel;
import com.astroMatch.astromatch.model.MessageModel;
import com.astroMatch.astromatch.model.UserModel;
import com.astroMatch.astromatch.repository.MatchRepository;
import com.astroMatch.astromatch.repository.MessageRepository;
import com.astroMatch.astromatch.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository, MatchRepository matchRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
    }

    public void sendMessage(Long senderId, Long receiverId, String content) {
        UserModel sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        UserModel receiver = userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar si hay un match mutuo antes de permitir mensajes
        Optional<MatchModel> match1 = matchRepository.findByUser1AndUser2(sender, receiver);
        Optional<MatchModel> match2 = matchRepository.findByUser1AndUser2(receiver, sender);

        if (!(match1.isPresent() && match2.isPresent() && match1.get().isMatched())) {
            throw new RuntimeException("No puedes enviar mensajes hasta que ambos hagan match.");
        }

        MessageModel message = new MessageModel(null, sender, receiver, content, LocalDateTime.now());
        messageRepository.save(message);
    }
    public List<MessageModel> getChat(Long user1Id, Long user2Id) {
        UserModel user1 = userRepository.findById(user1Id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        UserModel user2 = userRepository.findById(user2Id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return messageRepository.findBySenderAndReceiverOrReceiverAndSenderOrderByTimestampAsc(user1, user2, user1, user2);
    }
}
