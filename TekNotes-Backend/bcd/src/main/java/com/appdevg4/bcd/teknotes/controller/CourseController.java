package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.entity.Course;
import com.appdevg4.bcd.teknotes.service.CourseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin
public class CourseController {

    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    @PostMapping
    public Course create(@RequestBody Course course) {
        return service.create(course);
    }

    @GetMapping
    public List<Course> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Course getById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public Course update(@PathVariable Integer id, @RequestBody Course course) {
        return service.update(id, course);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
