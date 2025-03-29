// src/main/java/com/astroMatch/astromatch/dto/UserMatchDTO.java
package com.astroMatch.astromatch.dto;

public class UserMatchDTO {
    private Long id;
    private String username;
    private int age;
    private String profileImageUrl;
    private String bio;
    private int compatibility;
    private boolean isMutual;

    public UserMatchDTO(Long id, String username, int age, String profileImageUrl, String bio, int compatibility, boolean isMutual) {
        this.id = id;
        this.username = username;
        this.age = age;
        this.profileImageUrl = profileImageUrl;
        this.bio = bio;
        this.compatibility = compatibility;
        this.isMutual = isMutual;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public int getAge() { return age; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public String getBio() { return bio; }
    public int getCompatibility() { return compatibility; }
    public boolean isMutual() { return isMutual; }
}
