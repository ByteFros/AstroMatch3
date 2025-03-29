package com.astroMatch.astromatch.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "matches")
public class MatchModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user1_id", nullable = false)
    private UserModel user1;

    @ManyToOne
    @JoinColumn(name = "user2_id", nullable = false)
    private UserModel user2;

    @Column(nullable = false)
    private boolean isMatched;


}
