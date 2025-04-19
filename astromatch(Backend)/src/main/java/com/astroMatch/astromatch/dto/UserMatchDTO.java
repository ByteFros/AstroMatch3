// src/main/java/com/astroMatch/astromatch/dto/UserMatchDTO.java
package com.astroMatch.astromatch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMatchDTO {
    private Long id;
    private String username;
    private int age;
    private String profileImageUrl;
    private String bio;
    private int compatibility;
    private boolean isMutual;
    private LocalDateTime lastActive;
    private boolean isOnline;


}
