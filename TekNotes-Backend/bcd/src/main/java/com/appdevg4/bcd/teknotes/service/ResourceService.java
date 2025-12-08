package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.entity.Course;
import com.appdevg4.bcd.teknotes.entity.Resource;
import com.appdevg4.bcd.teknotes.entity.User;
import com.appdevg4.bcd.teknotes.repository.CourseRepository;
import com.appdevg4.bcd.teknotes.repository.ResourceRepository;
import com.appdevg4.bcd.teknotes.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository repo;
    private final UserRepository userRepo;
    private final CourseRepository courseRepo;

    private final String uploadDir = "uploads";

    public ResourceService(ResourceRepository repo,
            UserRepository userRepo,
            CourseRepository courseRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.courseRepo = courseRepo;
    }

    // ---------- existing CRUD ----------

    public Resource create(Resource resource) {
        return repo.save(resource);
    }

    public List<Resource> findAll() {
        return repo.findAll();
    }

    public List<Resource> findByUserId(Integer userId) {
        return repo.findByUploaderUserId(userId);
    }

    public Resource findById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found: " + id));
    }

    public Resource update(Integer id, Resource updated) {
        Resource r = findById(id);
        r.setTitle(updated.getTitle());
        r.setFileUrl(updated.getFileUrl());
        r.setTagName(updated.getTagName());
        r.setTagDescription(updated.getTagDescription());
        r.setUploader(updated.getUploader());
        r.setCourse(updated.getCourse());
        r.setCreatedAt(updated.getCreatedAt());
        return repo.save(r);
    }

    // ResourceService.java (FIXED)
public void deleteById(Integer id) {
    repo.deleteById(id);
}

    

    // Find or create a resource from a shared file
    public Resource findOrCreateResourceFromSharedFile(String fileUrl, String fileName, Integer uploadedByUserId) {
        // First, try to find existing resource with same fileUrl
        java.util.Optional<Resource> existing = repo.findByFileUrl(fileUrl);
        if (existing.isPresent()) {
            return existing.get();
        }

        // If not found, create a new resource entry
        User uploader = userRepo.findById(uploadedByUserId)
                .orElseThrow(() -> new RuntimeException("User not found: " + uploadedByUserId));

        // Find or create a default course for shared files (to avoid duplicates)
        Course defaultCourse = courseRepo.findByCourseNameIgnoreCaseAndTeacherNameIgnoreCase(
                "Shared from Study Group", "").orElse(null);
        
        if (defaultCourse == null) {
            defaultCourse = new Course();
            defaultCourse.setCourseName("Shared from Study Group");
            defaultCourse.setCourseCode("GROUP");
            defaultCourse.setTeacherName("");
            defaultCourse.setDepartment("");
            defaultCourse = courseRepo.save(defaultCourse);
        }

        Resource resource = new Resource();
        resource.setUploader(uploader);
        resource.setCourse(defaultCourse);
        resource.setTitle(fileName != null ? fileName : "Shared File");
        resource.setFileUrl(fileUrl);
        resource.setTagName("Study Group Shared File");
        resource.setTagDescription("File shared in a study group");
        resource.setCreatedAt(java.time.LocalDateTime.now());

        return repo.save(resource);
    }

    // ---------- NEW: upload logic ----------

    public Resource uploadResource(MultipartFile file,
            String title,
            String description,
            String courseName,
            String courseCode,
            String teacherName,
            String department,
            String tags,
            Integer userId) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        // uploader (User)
        User uploader = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // course: find or create
        Course course = null;

        if (courseCode != null && !courseCode.isBlank()) {
            course = courseRepo.findByCourseCodeIgnoreCase(courseCode).orElse(null);
        }
        if (course == null && courseName != null && !courseName.isBlank()
                && teacherName != null && !teacherName.isBlank()) {
            course = courseRepo
                    .findByCourseNameIgnoreCaseAndTeacherNameIgnoreCase(courseName, teacherName)
                    .orElse(null);
        }
        if (course == null) {
            course = new Course();
            course.setCourseName(courseName != null ? courseName : "General");
            course.setCourseCode(courseCode != null ? courseCode : "");
            course.setTeacherName(teacherName != null ? teacherName : "");
            course.setDepartment(department != null ? department : "");
            courseRepo.save(course);
        } else {
            // Update department if provided and course exists
            if (department != null && !department.isBlank()) {
                course.setDepartment(department);
                courseRepo.save(course);
            }
        }

        // save file to disk
        Path uploadPath = Paths.get(uploadDir);
        if (Files.notExists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String cleanFilename = originalFilename != null
                ? originalFilename.replace(" ", "_")
                : "file";

        String storedFileName = System.currentTimeMillis() + "_" + cleanFilename;
        Path filePath = uploadPath.resolve(storedFileName);

        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = "/uploads/" + storedFileName;

        // create Resource entity
        Resource resource = new Resource();
        resource.setUploader(uploader);
        resource.setCourse(course);
        resource.setTitle(title);
        resource.setFileUrl(fileUrl);
        resource.setTagName(tags);
        resource.setTagDescription(description);
        resource.setCreatedAt(LocalDateTime.now());

        return repo.save(resource);
    }
}