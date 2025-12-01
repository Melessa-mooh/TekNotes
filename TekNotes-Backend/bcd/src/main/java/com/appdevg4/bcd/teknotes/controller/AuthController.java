// controller/AuthController.java
package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.dto.LoginRequest;
import com.appdevg4.bcd.teknotes.dto.RegisterRequest;
import com.appdevg4.bcd.teknotes.dto.UserDto;
import com.appdevg4.bcd.teknotes.entity.User;
import com.appdevg4.bcd.teknotes.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")   // change if your React port is different
public class AuthController {

    private final UserService userService;

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
        user.setRole("student");   // default

        User saved = userService.register(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(UserDto.from(saved));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userService.login(request.getEmail(), request.getPassword());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(UserDto.from(userOpt.get()));
    }
}