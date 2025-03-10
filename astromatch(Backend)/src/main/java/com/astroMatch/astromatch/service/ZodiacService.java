package com.astroMatch.astromatch.service;

import com.astroMatch.astromatch.model.ZodiacModel;
import com.astroMatch.astromatch.repository.ZodiacRepository;
import org.springframework.stereotype.Service;

@Service
public class ZodiacService {

    private final ZodiacRepository zodiacRepository;

    public ZodiacService(ZodiacRepository zodiacRepository) {
        this.zodiacRepository = zodiacRepository;
    }

    public int getCompatibility(String userSign, String otherUserSign) {
        return zodiacRepository.findBySign1AndSign2(userSign, otherUserSign)
                .map(ZodiacModel::getCompatibility)
                .orElse(0); // Si no hay dato, asumimos compatibilidad 0
    }

}