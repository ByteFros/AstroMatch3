package com.astroMatch.astromatch.repository;

import com.astroMatch.astromatch.model.MessageModel;
import com.astroMatch.astromatch.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<MessageModel, Long> {

    @Query("""
        SELECT m
          FROM MessageModel m
         WHERE (m.sender   = :user1 AND m.receiver = :user2)
            OR (m.sender   = :user2 AND m.receiver = :user1)
         ORDER BY m.timestamp ASC
    """)
    List<MessageModel> findChatBetween(
            @Param("user1") UserModel user1,
            @Param("user2") UserModel user2
    );

    List<MessageModel> findBySenderAndReceiver(UserModel sender, UserModel receiver);
}
