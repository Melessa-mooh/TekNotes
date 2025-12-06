package com.appdevg4.bcd.teknotes.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @Column(nullable = false, length = 100)
    private String firstName;

    @Column(nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, length = 150, unique = true)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    @Column(nullable = false, length = 20)
    private String role;

    @Column(length = 50)
    private String status; // ✅ 1. ADD THIS FIELD

    @Column(columnDefinition = "TEXT")
    private String studyPreferences;

    // --- ADD THIS FIELD ---
    @Lob // Large Object
    @Column(columnDefinition = "LONGTEXT") // Allows massive strings (Base64 images)
    private String profilePic;

    public User() {
    }

    public Integer getUserId() {
        return userId;
    }
    public void setUserId(Integer userId) {
        this.userId = userId;
    }
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public String getStudyPreferences() {
        return studyPreferences;
    }

    // --- ADD THESE METHODS ---
    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }
    public String getProfilePic() {
        return profilePic;
    }

    // ✅ 2. ADD THESE GETTERS AND SETTERS
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    public void setStudyPreferences(String studyPreferences) {
        this.studyPreferences = studyPreferences;
    }
    
}
