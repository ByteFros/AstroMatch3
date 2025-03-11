package com.astroMatch.astromatch.utils;

import com.astroMatch.astromatch.model.ZodiacModel;
import com.astroMatch.astromatch.repository.ZodiacRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class ZodiacDataSeeder implements CommandLineRunner {

    private final ZodiacRepository zodiacRepository;
    private final Random random = new Random();

    public ZodiacDataSeeder(ZodiacRepository zodiacRepository) {
        this.zodiacRepository = zodiacRepository;
    }

    @Override
    public void run(String... args) {
        if (zodiacRepository.count() == 0) { // Solo insertar si la tabla está vacía
            List<String> signos = List.of(
                    "Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo",
                    "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"
            );

            Map<String, Integer> compatibilityMap = new HashMap<>();

            for (String sign1 : signos) {
                for (String sign2 : signos) {
                    String key1 = sign1 + "-" + sign2; // Ejemplo: "Cáncer-Virgo"
                    String key2 = sign2 + "-" + sign1; // Ejemplo: "Virgo-Cáncer"

                    int compatibility;

                    if (compatibilityMap.containsKey(key2)) {
                        // ✅ Si ya existe la combinación inversa, usar el mismo valor
                        compatibility = compatibilityMap.get(key2);
                    } else {
                        // ✅ Si es una combinación nueva, generar el valor
                        if (sign1.equals(sign2)) {
                            compatibility = 50 + random.nextInt(51); // Entre 50 y 100 si es el mismo signo
                        } else {
                            compatibility = random.nextInt(101); // Entre 0 y 100 para signos diferentes
                        }
                        compatibilityMap.put(key1, compatibility); // Guardamos en el mapa
                    }

                    // ✅ Insertar en la base de datos con la misma compatibilidad en ambas direcciones
                    ZodiacModel compatibilityEntry = new ZodiacModel();
                    compatibilityEntry.setSign1(sign1);
                    compatibilityEntry.setSign2(sign2);
                    compatibilityEntry.setCompatibility(compatibility);
                    zodiacRepository.save(compatibilityEntry);
                }
            }
            System.out.println("⚡ Datos de compatibilidad zodiacal insertados correctamente con valores bilaterales.");
        }
    }
}
