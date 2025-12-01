package com.appdevg4.bcd.teknotes.repository;

import com.appdevg4.bcd.teknotes.entity.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ResourceRepository extends JpaRepository<Resource, Integer> {
    List<Resource> findByTagNameContainingIgnoreCase(String tagName);
    List<Resource> findByCourse_TeacherNameContainingIgnoreCase(String teacherName);
}