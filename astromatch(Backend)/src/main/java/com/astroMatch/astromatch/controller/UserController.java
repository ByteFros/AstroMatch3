package com.astroMatch.astromatch.controller;

import com.astroMatch.astromatch.model.UserModel;
import com.astroMatch.astromatch.service.CsvImportService;
import com.astroMatch.astromatch.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/user")
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


}
