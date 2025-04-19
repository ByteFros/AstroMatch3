package com.astroMatch.astromatch.controller;

import com.astroMatch.astromatch.dto.MessageDTO;
import com.astroMatch.astromatch.model.MessageModel;
import com.astroMatch.astromatch.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody Map<String, Object> payload) {
        Long senderId = Long.valueOf(payload.get("senderId").toString());
        Long receiverId = Long.valueOf(payload.get("receiverId").toString());
        String content = payload.get("content").toString();

        try {
            messageService.sendMessage(senderId, receiverId, content);
            return ResponseEntity.ok("Mensaje enviado con éxito");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("/chat/{user1Id}/{user2Id}")
    public ResponseEntity<List<MessageDTO>> getChat(
            @PathVariable Long user1Id,
            @PathVariable Long user2Id) {
        return ResponseEntity.ok(
                messageService.getChat(user1Id, user2Id)
        );
    }


    @PostMapping("/chat/{user1Id}/{user2Id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long user1Id,
            @PathVariable Long user2Id) {
        messageService.markAsRead(user1Id, user2Id);
        return ResponseEntity.ok().build();
    }
}
