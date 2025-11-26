package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.entity.User;
import com.appdevg4.bcd.teknotes.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository repo;

    public UserService(UserRepository repo) {
        this.repo = repo;
    }

    public User create(User user) {
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
        existing.setPassword(updated.getPassword());
        existing.setRole(updated.getRole());
        existing.setStudyPreferences(updated.getStudyPreferences());
        return repo.save(existing);
    }

    public void delete(Integer id) {
        repo.deleteById(id);
    }

    public User register(User user) {
        if (repo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered: " + user.getEmail());
        }
        return repo.save(user);
    }

    public Optional<User> login(String email, String password) {
        return repo.findByEmail(email)
                .filter(u -> u.getPassword().equals(password)); 
    }
}
