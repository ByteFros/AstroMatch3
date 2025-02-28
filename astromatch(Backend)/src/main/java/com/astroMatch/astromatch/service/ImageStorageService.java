package com.astroMatch.astromatch.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;

@Service
public class ImageStorageService {

    @Value("${upload.directory}") // Definir en application.properties
    private String uploadDir;

    public String storeImage(MultipartFile file, String username) throws IOException {
        // Validar si el directorio existe
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Nombre de archivo con username para evitar duplicados
        String fileName = username + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Retorna la URL accesible para la imagen
        return "/uploads/" + fileName;
    }
}
