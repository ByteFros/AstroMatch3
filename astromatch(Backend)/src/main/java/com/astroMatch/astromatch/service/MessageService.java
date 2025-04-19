package com.astroMatch.astromatch.service;

import com.astroMatch.astromatch.dto.MessageDTO;
import com.astroMatch.astromatch.model.MatchModel;
import com.astroMatch.astromatch.model.MessageModel;
import com.astroMatch.astromatch.model.UserModel;
import com.astroMatch.astromatch.repository.MatchRepository;
import com.astroMatch.astromatch.repository.MessageRepository;
import com.astroMatch.astromatch.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private MessageDTO toDto(MessageModel m) {
        MessageDTO dto = new MessageDTO();
        dto.setId(m.getId());
        dto.setSenderId(m.getSender().getId());
        dto.setReceiverId(m.getReceiver().getId());
        dto.setContent(m.getContent());
        dto.setTimestamp(m.getTimestamp());
        dto.setRead(m.isRead());
        return dto;
    }

    public void sendMessage(Long senderId, Long receiverId, String content) {
        UserModel sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        UserModel receiver = userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Verificar si hay un match mutuo antes de permitir mensajes
        Optional<MatchModel> match = matchRepository.findByUsers(sender, receiver);
        if (match.isEmpty() || !match.get().isMatched()) {
            throw new RuntimeException("No puedes enviar mensajes hasta que ambos hagan match.");
        }


        MessageModel message = new MessageModel(null, sender, receiver, content, LocalDateTime.now(), false);
        messageRepository.save(message);
    }
    public List<MessageDTO> getChat(Long user1Id, Long user2Id) {
        UserModel user1 = userRepository.findById(user1Id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        UserModel user2 = userRepository.findById(user2Id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<MessageModel> messages = messageRepository.findChatBetween(user1, user2);

        List<MessageDTO> dtos = new ArrayList<>();
        for (MessageModel message : messages) {
            dtos.add(toDto(message));
        }
        return dtos;
    }
    @Transactional
    public void markAsRead(Long user1Id, Long user2Id) {
        UserModel sender = userRepository.findById(user1Id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        UserModel receiver = userRepository.findById(user2Id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        messageRepository
                .findBySenderAndReceiver(sender,receiver)
                .forEach(m -> m.setRead(true));
    }
}
