package com.astroMatch.astromatch.utils;

import java.util.HashMap;
import java.util.Map;

public class ZodiacCompatibility {
    private static final Map<String, Map<String, Integer>> compatibilityMap = new HashMap<>();

    static {
        compatibilityMap.put("aries", Map.of("leo", 90, "sagittarius", 85, "gemini", 80, "libra", 75, "aries", 70));
        compatibilityMap.put("taurus", Map.of("virgo", 90, "capricorn", 85, "cancer", 80, "pisces", 75, "taurus", 70));
        compatibilityMap.put("gemini", Map.of("libra", 90, "aquarius", 85, "aries", 80, "leo", 75, "gemini", 70));
        compatibilityMap.put("cancer", Map.of("scorpio", 90, "pisces", 85, "taurus", 80, "virgo", 75, "cancer", 70));
        compatibilityMap.put("leo", Map.of("aries", 90, "sagittarius", 85, "gemini", 80, "libra", 75, "leo", 70));
        compatibilityMap.put("virgo", Map.of("taurus", 90, "capricorn", 85, "cancer", 80, "scorpio", 75, "virgo", 70));
        compatibilityMap.put("libra", Map.of("gemini", 90, "aquarius", 85, "leo", 80, "sagittarius", 75, "libra", 70));
        compatibilityMap.put("scorpio", Map.of("cancer", 90, "pisces", 85, "virgo", 80, "capricorn", 75, "scorpio", 70));
        compatibilityMap.put("sagittarius", Map.of("leo", 90, "aries", 85, "libra", 80, "aquarius", 75, "sagittarius", 70));
        compatibilityMap.put("capricorn", Map.of("taurus", 90, "virgo", 85, "scorpio", 80, "pisces", 75, "capricorn", 70));
        compatibilityMap.put("aquarius", Map.of("libra", 90, "gemini", 85, "sagittarius", 80, "aries", 75, "aquarius", 70));
        compatibilityMap.put("pisces", Map.of("cancer", 90, "scorpio", 85, "taurus", 80, "capricorn", 75, "pisces", 70));
    }

    public static int getCompatibility(String userSign, String partnerSign) {
        return compatibilityMap.getOrDefault(userSign, new HashMap<>()).getOrDefault(partnerSign, 50); // Default 50%
    }
}
