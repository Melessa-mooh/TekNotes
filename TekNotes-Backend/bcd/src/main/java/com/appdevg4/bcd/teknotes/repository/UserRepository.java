package com.appdevg4.bcd.teknotes.repository;

import com.appdevg4.bcd.teknotes.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
}
