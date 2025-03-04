package com.astroMatch.astromatch.service;

import com.astroMatch.astromatch.model.Role;
import com.astroMatch.astromatch.model.UserModel;
import com.astroMatch.astromatch.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserModel> getAllUserUsers(){
        return userRepository.findByRole(Role.USER);
    }

    public List<UserModel> getAllProfiles(){
        return userRepository.findAll();
    }
}
