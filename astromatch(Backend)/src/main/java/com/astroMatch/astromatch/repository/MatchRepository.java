package com.astroMatch.astromatch.repository;

import com.astroMatch.astromatch.model.MatchModel;
import com.astroMatch.astromatch.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRepository extends JpaRepository<MatchModel, Long> {
    Optional<MatchModel> findByUser1AndUser2(UserModel user1, UserModel user2);
    Optional<MatchModel> findByUser2AndUser1(UserModel user2, UserModel user1);


    List<MatchModel> findByUser1AndIsMatchedFalse(UserModel user1);


    List<MatchModel> findByUser1(UserModel user);

    List<MatchModel> findByIsMatchedTrueAndUser1OrUser2(UserModel user1, UserModel user2);

    @Query("""
  SELECT m FROM MatchModel m
  WHERE (m.user1 = :u1 AND m.user2 = :u2)
     OR (m.user1 = :u2 AND m.user2 = :u1)
""")
    Optional<MatchModel> findByUsers(@Param("u1") UserModel u1, @Param("u2") UserModel u2);

}
