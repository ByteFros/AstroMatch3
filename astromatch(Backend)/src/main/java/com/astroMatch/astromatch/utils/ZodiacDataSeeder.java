package com.astroMatch.astromatch.utils;

import com.astroMatch.astromatch.model.ZodiacModel;
import com.astroMatch.astromatch.repository.ZodiacRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Random;

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

            for (String sign1 : signos) {
                for (String sign2 : signos) {
                    int compatibility;

                    if (sign1.equals(sign2)) {
                        // Si los signos son iguales, asignar compatibilidad más alta (ej. 50-100)
                        compatibility = 50 + random.nextInt(51); // Entre 50 y 100
                    } else {
                        // Si los signos son diferentes, asignar un valor aleatorio de 0 a 100
                        compatibility = random.nextInt(101);
                    }

                    ZodiacModel compatibilityEntry = new ZodiacModel();
                    compatibilityEntry.setSign1(sign1);
                    compatibilityEntry.setSign2(sign2);
                    compatibilityEntry.setCompatibility(compatibility);
                    zodiacRepository.save(compatibilityEntry);
                }
            }
            System.out.println("⚡ Datos de compatibilidad zodiacal insertados exitosamente (incluyendo signos iguales)");
        }
    }
}
