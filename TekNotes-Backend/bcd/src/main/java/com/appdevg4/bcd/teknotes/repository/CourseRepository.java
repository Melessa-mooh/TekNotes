package com.appdevg4.bcd.teknotes.repository;

import com.appdevg4.bcd.teknotes.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Integer> {
}
