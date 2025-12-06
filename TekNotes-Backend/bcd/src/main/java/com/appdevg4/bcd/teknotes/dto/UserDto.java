package com.appdevg4.bcd.teknotes.dto;

import com.appdevg4.bcd.teknotes.entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserDto {
    private Integer id;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
    private String studyPreferences;
    // --- ADD THIS FIELD ---
    private String profilePic;

    public static UserDto from(User u) {
        UserDto dto = new UserDto();
        dto.id = u.getUserId();   
        dto.firstName = u.getFirstName();
        dto.lastName = u.getLastName();
        dto.email = u.getEmail();
        dto.role = u.getRole();
        dto.studyPreferences = u.getStudyPreferences();

        // --- ADD THIS LINE ---
        dto.profilePic = u.getProfilePic();
        return dto;
    }
}