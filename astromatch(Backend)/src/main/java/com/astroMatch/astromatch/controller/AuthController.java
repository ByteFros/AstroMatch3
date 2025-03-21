package com.astroMatch.astromatch.controller;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.astroMatch.astromatch.model.Role;
import com.astroMatch.astromatch.model.UserModel;
import com.astroMatch.astromatch.repository.UserRepository;
import com.astroMatch.astromatch.security.jwt.JwtUtil;
import com.astroMatch.astromatch.service.ImageStorageService;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")  // Quitamos la barra final y usamos allowCredentials en la config global
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ImageStorageService imageStorageService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, ImageStorageService imageStorageService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.imageStorageService = imageStorageService;

    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam("age") Integer age,
            @RequestParam("gender") String gender,
            @RequestParam("preferredGender") String preferredGender,
            @RequestParam("zodiacSign") String zodiacSign, // ✅ Signo zodiacal
            @RequestParam("file") MultipartFile file) {

        // Lista de signos zodiacales válidos
        List<String> validZodiacSigns = List.of(
                "Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo",
                "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis"
        );

        // ✅ Verificar si el signo ingresado es válido
        if (!validZodiacSigns.contains(zodiacSign)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Signo zodiacal inválido"));
        }

        // Verificar si el usuario ya existe
        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El usuario ya existe"));
        }

        try {
            // Guardar imagen y obtener URL
            String imageUrl = imageStorageService.storeImage(file, username);

            // Crear usuario
            UserModel user = new UserModel();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setEmail(email);
            user.setAge(age);
            user.setGender(gender);
            user.setPreferredGender(preferredGender);
            user.setZodiacSign(zodiacSign);
            user.setProfileImageUrl(imageUrl);
            user.setRole(Role.USER);

            // Guardar usuario en la BD
            UserModel savedUser = userRepository.save(user);

            // Generar token JWT
            String token = jwtUtil.generateToken(savedUser.getUsername());

            // Respuesta
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Usuario registrado con éxito");
            response.put("token", token);
            response.put("role", savedUser.getRole());
            response.put("imageUrl", savedUser.getProfileImageUrl());
            response.put("zodiacSign", savedUser.getZodiacSign());

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error al subir la imagen: " + e.getMessage()));
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserModel user) {
        Optional<UserModel> foundUser = userRepository.findByUsername(user.getUsername());

        if (foundUser.isEmpty() || !passwordEncoder.matches(user.getPassword(), foundUser.get().getPassword())) {
            return ResponseEntity.status(403    ).body(Map.of("message", "Usuario o Contraseña incorrectos"));
        }

        UserModel loggedUser = foundUser.get();
        String token = jwtUtil.generateToken(loggedUser.getUsername());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", loggedUser.getRole());
        response.put("username", loggedUser.getUsername());

        return ResponseEntity.ok(response);
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logout exitoso"));
    }

    @GetMapping("/isLoggedIn")
    public ResponseEntity<?> isLoggedIn(@RequestHeader("Authorization") String token) {
        try {
            // Verificar si el token es válido
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("isLoggedIn", false, "message", "Token no proporcionado o inválido"));
            }

            // Extraer el token sin el prefijo "Bearer "
            String jwtToken = token.substring(7);

            // Validar el token
            String username = jwtUtil.extractUsername(jwtToken);
            if (username == null || userRepository.findByUsername(username).isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("isLoggedIn", false, "message", "Token inválido o usuario no encontrado"));
            }

            // Si el token es válido y el usuario existe
            return ResponseEntity.ok(Map.of("isLoggedIn", true, "username", username));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("isLoggedIn", false, "message", "Error al validar el token: " + e.getMessage()));
        }
    }
}