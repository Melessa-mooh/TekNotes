package com.appdevg4.bcd.teknotes.repository;

import com.appdevg4.bcd.teknotes.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Integer> {

    Optional<Course> findByCourseCodeIgnoreCase(String courseCode);

    Optional<Course> findByCourseNameIgnoreCaseAndTeacherNameIgnoreCase(
            String courseName,
            String teacherName
    );
}