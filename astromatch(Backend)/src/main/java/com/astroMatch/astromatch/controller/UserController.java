package com.astroMatch.astromatch.controller;

import com.astroMatch.astromatch.model.UserModel;
import com.astroMatch.astromatch.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserModel>> getAllUsers(){
        List<UserModel> users = userService.getAllUserUsers();
        return ResponseEntity.ok(users);
    }
}
