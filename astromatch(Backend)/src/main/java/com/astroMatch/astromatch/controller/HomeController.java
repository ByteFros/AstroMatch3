package com.astroMatch.astromatch.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class HomeController {

    @GetMapping("/user")
    public ResponseEntity<?> userHome() {
        return ResponseEntity.ok(Map.of(
                "message", "Bienvenido al área de usuarios",
                "status", "success"
        ));
    }

    @GetMapping("/admin")
    public ResponseEntity<?> adminHome() {
        return ResponseEntity.ok(Map.of(
                "message", "Bienvenido al área de admins",
                "status", "success"
        ));
    }

    @GetMapping("/superadmin")
    public ResponseEntity<?> superHome() {
        return ResponseEntity.ok(Map.of(
                "message", "Bienvenido al área de superadmins",
                "status", "success"
        ));
    }
}