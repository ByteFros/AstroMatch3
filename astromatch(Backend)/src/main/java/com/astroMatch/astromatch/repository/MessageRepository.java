package com.astroMatch.astromatch.repository;

import com.astroMatch.astromatch.model.MessageModel;
import com.astroMatch.astromatch.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<MessageModel, Long> {
    List<MessageModel> findBySenderAndReceiverOrReceiverAndSenderOrderByTimestampAsc(UserModel sender, UserModel receiver, UserModel receiver2, UserModel sender2);
}
