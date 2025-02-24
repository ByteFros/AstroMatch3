package com.astroMatch.astromatch.controller;
import com.astroMatch.astromatch.model.UserModel;
import com.astroMatch.astromatch.repository.UserRepository;
import com.astroMatch.astromatch.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")  // Quitamos la barra final y usamos allowCredentials en la config global
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserModel user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "El usuario ya existe"));
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        UserModel savedUser = userRepository.save(user);

        // Generamos el token inmediatamente después del registro
        String token = jwtUtil.generateToken(savedUser.getUsername());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Usuario registrado con éxito");
        response.put("token", token);
        response.put("role", savedUser.getRole());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserModel user) {
        Optional<UserModel> foundUser = userRepository.findByUsername(user.getUsername());

        if (foundUser.isEmpty() || !passwordEncoder.matches(user.getPassword(), foundUser.get().getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Usuario o Contraseña incorrectos"));
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
}