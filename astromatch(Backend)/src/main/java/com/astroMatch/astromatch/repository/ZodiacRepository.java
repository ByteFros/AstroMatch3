package com.astroMatch.astromatch.repository;

import com.astroMatch.astromatch.model.ZodiacModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ZodiacRepository extends JpaRepository<ZodiacModel, Long> {
    Optional<ZodiacModel> findBySign1AndSign2(String sign1, String sign2);
}
