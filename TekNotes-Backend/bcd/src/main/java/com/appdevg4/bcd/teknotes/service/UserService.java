package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.entity.User;
import com.appdevg4.bcd.teknotes.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repo;
    private final BCryptPasswordEncoder encoder;

    public UserService(UserRepository repo, BCryptPasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    // generic create (if you use it, make sure it encodes)
    public User create(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }

    public List<User> findAll() {
        return repo.findAll();
    }

    public User findById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found: " + id));
    }

    public User update(Integer id, User updated) {
        User existing = findById(id);
        existing.setFirstName(updated.getFirstName());
        existing.setLastName(updated.getLastName());
        existing.setEmail(updated.getEmail());
        existing.setRole(updated.getRole());
        existing.setStudyPreferences(updated.getStudyPreferences());

        // only re-encode if user actually sends a new password
        if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
            existing.setPassword(encoder.encode(updated.getPassword()));
        }

        return repo.save(existing);
    }

    public void delete(Integer id) {
        repo.deleteById(id);
    }

    // REGISTER
    public User register(User user) {
        if (repo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered: " + user.getEmail());
        }

        user.setPassword(encoder.encode(user.getPassword()));
        return repo.save(user);
    }

    // LOGIN
    public Optional<User> login(String email, String password) {
        Optional<User> user = repo.findByEmail(email);
        if (user.isPresent() && encoder.matches(password, user.get().getPassword())) {
            return user;
        }
        return Optional.empty();
    }
}