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

    public void delete(Integer id) {
        repo.deleteById(id);
    }

    // ---------- NEW: upload logic ----------

    public Resource uploadResource(MultipartFile file,
            String title,
            String description,
            String courseName,
            String courseCode,
            String teacherName,
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
            courseRepo.save(course);
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