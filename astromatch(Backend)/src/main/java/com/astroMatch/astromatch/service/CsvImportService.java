package com.astroMatch.astromatch.service;

import com.astroMatch.astromatch.model.Role;
import com.astroMatch.astromatch.model.UserModel;
import com.astroMatch.astromatch.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvImportService {

    private final UserRepository userRepository;

    public CsvImportService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void importCsv(MultipartFile file) {
        List<UserModel> users = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            boolean firstLine = true; // Para omitir la cabecera del CSV

            while ((line = reader.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                String[] data = line.split(",");
                if (data.length >= 4) {  // Validamos que tenga los campos mínimos
                    UserModel user = new UserModel();
                    user.setUsername(data[0].trim());
                    user.setPassword(data[1].trim());
                    user.setRole(Role.valueOf(data[2].trim()));
                    user.setZodiacSign(data[3].trim());

                    if (data.length >= 5) {
                        user.setProfileImageUrl(data[4].trim());
                    }

                    if (data.length >= 6) {
                        user.setGender(data[5].trim());
                    }

                    users.add(user);
                }
            }

            userRepository.saveAll(users);

        } catch (Exception e) {
            throw new RuntimeException("Error al procesar el archivo CSV: " + e.getMessage());
        }
    }
}
