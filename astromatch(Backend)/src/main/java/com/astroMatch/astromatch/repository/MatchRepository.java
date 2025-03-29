package com.astroMatch.astromatch.repository;

import com.astroMatch.astromatch.model.MatchModel;
import com.astroMatch.astromatch.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRepository extends JpaRepository<MatchModel, Long> {
    Optional<MatchModel> findByUser1AndUser2(UserModel user1, UserModel user2);
    Optional<MatchModel> findByUser2AndUser1(UserModel user2, UserModel user1);


    List<MatchModel> findByUser1AndIsMatchedFalse(UserModel user1);


    List<MatchModel> findByUser1(UserModel user);

}
