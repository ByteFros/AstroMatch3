// File: UserController.java
package com.astroMatch.astromatch.controller;

import com.astroMatch.astromatch.model.UserModel;
import com.astroMatch.astromatch.repository.UserRepository;
import com.astroMatch.astromatch.service.CsvImportService;
import com.astroMatch.astromatch.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    private final CsvImportService csvImportService;
    private final UserRepository userRepository;

    public UserController(UserService userService, CsvImportService csvImportService, UserRepository userRepository) {
        this.userService = userService;
        this.csvImportService = csvImportService;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UserModel> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        Optional<UserModel> user = userRepository.findByUsername(userDetails.getUsername());
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<UserModel> updateCurrentUser(@AuthenticationPrincipal UserDetails userDetails,
                                                       @RequestBody UserModel updates) {
        Optional<UserModel> userOpt = userRepository.findByUsername(userDetails.getUsername());
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        UserModel user = userOpt.get();
        user.setUsername(updates.getUsername());
        user.setEmail(updates.getEmail());
        user.setBio(updates.getBio());
        user.setProfileImageUrl(updates.getProfileImageUrl());
        // Campos opcionales si quieres permitir actualizarlos
        user.setAge(updates.getAge());
        user.setGender(updates.getGender());
        user.setPreferredGender(updates.getPreferredGender());
        user.setZodiacSign(updates.getZodiacSign());

        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserModel>> getAllUsers() {
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
        List<UserModel> users = userService.getAllUserUsers();

        List<Object> formattedUsers = users.stream().map(user -> new Object() {
            public final Long id = user.getId();
            public final String name = user.getUsername();
            public final int age = user.getAge();
            public final String image = user.getProfileImageUrl();
            public final String bio = user.getBio() != null ? user.getBio() : "No bio available";
        }).collect(Collectors.toList());

        return ResponseEntity.ok(formattedUsers);
    }
}
