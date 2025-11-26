package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.entity.User;
import com.appdevg4.bcd.teknotes.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // ========= REGISTER =========
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {

        String firstName = body.get("firstName");
        String lastName = body.get("lastName");
        String email = body.get("email");
        String password = body.get("password");

        // default role
        String role = "STUDENT";

        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);

        User saved = userService.register(user);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Registration successful",
                        "userId", saved.getUserId(),
                        "role", saved.getRole()));
    }

    // ========= LOGIN =========
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String password = body.get("password");

        Optional<User> loggedIn = userService.login(email, password);

        return loggedIn
                .map(u -> ResponseEntity.ok(
                        Map.of(
                                "message", "Login successful",
                                "userId", u.getUserId(),
                                "role", u.getRole())))
                .orElseGet(() -> ResponseEntity
                        .status(401)
                        .body(Map.of("message", "Invalid credentials")));
    }
}
