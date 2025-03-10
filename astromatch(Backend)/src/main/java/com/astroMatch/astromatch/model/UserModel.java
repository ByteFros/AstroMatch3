package com.astroMatch.astromatch.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users2")
public class UserModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private String gender;

    @Column(nullable = false)
    private String preferredGender;

    @Column(length = 500)
    private String bio;

    @Column(nullable = false)
    private String zodiacSign;

    @Column(nullable = false)
    private String profileImageUrl;
}
