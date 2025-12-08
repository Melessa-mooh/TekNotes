package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.dto.ResourceDto;
import com.appdevg4.bcd.teknotes.entity.Resource;
import com.appdevg4.bcd.teknotes.service.ResourceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ResourceDto> uploadResource(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "courseName", required = false) String courseName,
            @RequestParam(value = "courseCode", required = false) String courseCode,
            @RequestParam(value = "teacherName", required = false) String teacherName,
            @RequestParam(value = "department", required = false) String department,
            @RequestParam(value = "tags", required = false) String tags,
            @RequestParam("userId") Integer userId) {
        try {
            Resource saved = resourceService.uploadResource(
                    file,
                    title,
                    description,
                    courseName,
                    courseCode,
                    teacherName,
                    department,
                    tags,
                    userId);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(ResourceDto.from(saved));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .build();
        }
    }

    @GetMapping
    public ResponseEntity<List<ResourceDto>> getAllResources() {
        try {
            List<Resource> resources = resourceService.findAll();
            List<ResourceDto> dtos = resources.stream()
                    .map(ResourceDto::from)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ResourceDto>> getUserResources(@PathVariable Integer userId) {
        try {
            List<Resource> resources = resourceService.findByUserId(userId);
            List<ResourceDto> dtos = resources.stream()
                    .map(ResourceDto::from)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceDto> getResourceById(@PathVariable Integer id) {
        try {
            Resource resource = resourceService.findById(id);
            return ResponseEntity.ok(ResourceDto.from(resource));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }


    // 🚀 NEW METHOD TO HANDLE DELETE REQUESTS
    @DeleteMapping("/{id}") // Maps DELETE requests to /api/resources/{id}
    public ResponseEntity<Void> deleteResource(@PathVariable Integer id) {
        try {
            // Call the service layer to perform the deletion logic
            resourceService.deleteById(id); 
            
            // Return 204 No Content for successful deletion
            return ResponseEntity.noContent().build(); 

        } catch (Exception e) {
            e.printStackTrace();
            // Return 404 if the resource was not found, or 500 for other errors
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}