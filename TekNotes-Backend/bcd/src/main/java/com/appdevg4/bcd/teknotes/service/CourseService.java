package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.entity.Course;
import com.appdevg4.bcd.teknotes.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository repo;

    public CourseService(CourseRepository repo) {
        this.repo = repo;
    }

    public Course create(Course course) {
        return repo.save(course);
    }

    public List<Course> findAll() {
        return repo.findAll();
    }

    public Course findById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found: " + id));
    }

    public Course update(Integer id, Course updated) {
        Course c = findById(id);
        c.setCourseName(updated.getCourseName());
        c.setCourseCode(updated.getCourseCode());
        c.setTeacherName(updated.getTeacherName());
        c.setDepartment(updated.getDepartment());
        return repo.save(c);
    }

    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
