// controller/AuthController.java
package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.dto.LoginRequest;
import com.appdevg4.bcd.teknotes.dto.RegisterRequest;
import com.appdevg4.bcd.teknotes.dto.UserDto;
import com.appdevg4.bcd.teknotes.entity.User;
import com.appdevg4.bcd.teknotes.security.JwtUtil;
import com.appdevg4.bcd.teknotes.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserDto> register(@RequestBody RegisterRequest request) {
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole("student"); // default

        User saved = userService.register(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserDto.from(saved));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        Optional<User> userOpt = userService.login(request.getEmail(), request.getPassword());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userOpt.get();

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail(), user.getUserId());

        // Create HTTP-only cookie
        Cookie jwtCookie = new Cookie("jwt", token);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false); // Set to true in production with HTTPS
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(24 * 60 * 60); // 24 hours
        jwtCookie.setAttribute("SameSite", "Lax");

        response.addCookie(jwtCookie);

        return ResponseEntity.ok(UserDto.from(user));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        // Clear the JWT cookie
        Cookie jwtCookie = new Cookie("jwt", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(false);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0);

        response.addCookie(jwtCookie);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(@CookieValue(name = "jwt", required = false) String token) {
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            String email = jwtUtil.extractUsername(token);
            Integer userId = jwtUtil.extractUserId(token);

            User user = userService.findById(userId);

            return ResponseEntity.ok(UserDto.from(user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}