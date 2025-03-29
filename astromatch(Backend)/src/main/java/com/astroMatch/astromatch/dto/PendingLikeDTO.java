// File: dto/PendingLikeDTO.java
package com.astroMatch.astromatch.dto;

public class PendingLikeDTO {

    private Long id;
    private String username;
    private int age;
    private String profileImageUrl;
    private String bio;

    public PendingLikeDTO(Long id, String username, int age, String profileImageUrl, String bio) {
        this.id = id;
        this.username = username;
        this.age = age;
        this.profileImageUrl = profileImageUrl;
        this.bio = bio;
    }

    public Long getId() {
        return id;
    }

    // Getters y setters
    public String getUsername() {
        return username;
    }

    public int getAge() {
        return age;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public String getBio() {
        return bio;
    }
}
