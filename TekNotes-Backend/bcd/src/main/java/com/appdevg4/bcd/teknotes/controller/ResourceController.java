package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.entity.Resource;
import com.appdevg4.bcd.teknotes.service.ResourceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:3000")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Resource> uploadResource(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "courseName", required = false) String courseName,
            @RequestParam(value = "courseCode", required = false) String courseCode,
            @RequestParam(value = "teacherName", required = false) String teacherName,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam("userId") Integer userId
    ) {
        try {
            Resource saved = resourceService.uploadResource(
                    file,
                    title,
                    description,
                    courseName,
                    courseCode,
                    teacherName,
                    tags,
                    userId
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .build();
        }
    }
}