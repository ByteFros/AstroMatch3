package com.astroMatch.astromatch.controller;

import com.astroMatch.astromatch.model.UserModel;
import com.astroMatch.astromatch.service.CsvImportService;
import com.astroMatch.astromatch.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final CsvImportService csvImportService;

    public UserController(UserService userService,CsvImportService csvImportService)
    {
        this.userService = userService;
        this.csvImportService = csvImportService;

    }

    @GetMapping("/all")
    public ResponseEntity<List<UserModel>> getAllUsers(){
        List<UserModel> users = userService.getAllUserUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/import-csv")
    public ResponseEntity<String> importCsv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Por favor, sube un archivo CSV válido.");
        }

        csvImportService.importCsv(file);
        return ResponseEntity.ok("Usuarios importados correctamente.");
    }

    @GetMapping("/profiles")
    public ResponseEntity<List<?>> getProfiles() {
        List<UserModel> users = userService.getAllProfiles();

        // Convertir datos para la vista en React
        List<Object> formattedUsers = users.stream().map(user -> {
            return new Object() {
                public final Long id = user.getId();
                public final String name = user.getUsername();
                public final int age = user.getAge();
                public final String image = user.getProfileImageUrl();
                public final String bio = user.getBio() != null ? user.getBio() : "No bio available";
            };
        }).collect(Collectors.toList());

        return ResponseEntity.ok(formattedUsers);
    }


}
