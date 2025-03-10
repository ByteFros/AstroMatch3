package com.astroMatch.astromatch.model;

import jakarta.persistence.*;

@Entity
@Table(name = "zodiac_compatibility")
public class ZodiacModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sign1;

    @Column(nullable = false)
    private String sign2;

    @Column(nullable = false)
    private int compatibility;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSign1() {
        return sign1;
    }

    public void setSign1(String sign1) {
        this.sign1 = sign1;
    }

    public String getSign2() {
        return sign2;
    }

    public void setSign2(String sign2) {
        this.sign2 = sign2;
    }

    public int getCompatibility() {
        return compatibility;
    }

    public void setCompatibility(int compatibility) {
        this.compatibility = compatibility;
    }

    // Constructores, Getters y Setters
}
