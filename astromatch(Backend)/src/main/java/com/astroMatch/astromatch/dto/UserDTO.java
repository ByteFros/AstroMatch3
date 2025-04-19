package com.astroMatch.astromatch.dto;

import java.time.LocalDateTime;

public class UserDTO {
    private Long id;
    private String username;
    private String profileImageUrl;
    private LocalDateTime lastActive;
    private boolean isOnline;

    public UserDTO(Long id, String username, String profileImageUrl, LocalDateTime lastActive, boolean isOnline) {
        this.id = id;
        this.username = username;
        this.profileImageUrl = profileImageUrl;
        this.lastActive = lastActive;
        this.isOnline = isOnline;
    }

    public UserDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getProfileImageUrl() {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public LocalDateTime getLastActive() {
        return lastActive;
    }

    public void setLastActive(LocalDateTime lastActive) {
        this.lastActive = lastActive;
    }

    public boolean isOnline() {
        return isOnline;
    }

    public void setOnline(boolean online) {
        isOnline = online;
    }
}
