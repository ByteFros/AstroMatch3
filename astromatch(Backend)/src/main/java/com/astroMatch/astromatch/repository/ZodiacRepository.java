package com.astroMatch.astromatch.repository;

import com.astroMatch.astromatch.model.ZodiacModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ZodiacRepository extends JpaRepository<ZodiacModel, Long> {
    ZodiacModel findBySign1AndSign2(String sign1, String sign2);
}
