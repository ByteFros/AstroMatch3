package com.astroMatch.astromatch.repository;

import com.astroMatch.astromatch.model.Role;
import com.astroMatch.astromatch.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserModel,Long> {
    Optional<UserModel> findByUsername(String username);

    List<UserModel> findByRole(Role role);
}
