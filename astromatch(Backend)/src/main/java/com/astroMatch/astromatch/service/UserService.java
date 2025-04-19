package com.astroMatch.astromatch.service;

import com.astroMatch.astromatch.dto.UserDTO;
import com.astroMatch.astromatch.model.Role;
import com.astroMatch.astromatch.model.UserModel;
import com.astroMatch.astromatch.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ZodiacService zodiacService;

    public UserService(UserRepository userRepository, ZodiacService zodiacService) {
        this.userRepository = userRepository;
        this.zodiacService = zodiacService;

    }

    public UserDTO toUserDTO(UserModel u) {
        UserDTO dto = new UserDTO();
        dto.setId(u.getId());
        dto.setUsername(u.getUsername());
        dto.setProfileImageUrl(u.getProfileImageUrl());
        dto.setLastActive(u.getLastActive());
        // Online si actividad en últimos 5 minutos
        boolean online =
                u.getLastActive() != null &&
                        u.getLastActive().isAfter(LocalDateTime.now().minusMinutes(5));
        dto.setOnline(online);
        return dto;
    }

    public List<UserModel> getAllUserUsers(){
        return userRepository.findByRole(Role.USER);
    }

    public List<UserModel> getAllProfiles(){
        return userRepository.findAll();
    }

    public List<Map<String, Object>> findMatchesByZodiac(String userSign, int minCompatibility, String preferredGender){
        List<UserModel> allUsers = userRepository.findByRole(Role.USER);
        List<Map<String, Object>> matches = new ArrayList<>();

        for (UserModel user : allUsers) {
            if(!user.getZodiacSign().equalsIgnoreCase(userSign)){
                int compatibility = zodiacService.getCompatibility(userSign, user.getZodiacSign());
                if(compatibility >= minCompatibility){

                    if(!preferredGender.equalsIgnoreCase("any") && !user.getGender().equalsIgnoreCase(preferredGender)){
                        continue;
                    }


                    Map<String, Object> matchData = new HashMap<>();

                    matchData.put("id", user.getId());
                    matchData.put("username", user.getUsername());
                    matchData.put("email", user.getEmail());
                    matchData.put("age", user.getAge());
                    matchData.put("gender", user.getGender());
                    matchData.put("preferredGender", user.getPreferredGender());
                    matchData.put("zodiacSign", user.getZodiacSign());
                    matchData.put("profileImageUrl", user.getProfileImageUrl());
                    matchData.put("bio", user.getBio());
                    matchData.put("compatibility", compatibility);

                    matches.add(matchData);
                }
            }
        }
        return matches;
    }


}
