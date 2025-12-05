package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.entity.GroupChat;
import com.appdevg4.bcd.teknotes.entity.SharedFile;
import com.appdevg4.bcd.teknotes.entity.User;
import com.appdevg4.bcd.teknotes.repository.GroupChatRepository;
import com.appdevg4.bcd.teknotes.repository.SharedFileRepository;
import com.appdevg4.bcd.teknotes.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class SharedFileService {

    private final SharedFileRepository sharedFileRepo;
    private final GroupChatRepository groupChatRepo;
    private final UserRepository userRepo;
    private final String uploadDir = "uploads/groups";

    public SharedFileService(SharedFileRepository sharedFileRepo,
                            GroupChatRepository groupChatRepo,
                            UserRepository userRepo) {
        this.sharedFileRepo = sharedFileRepo;
        this.groupChatRepo = groupChatRepo;
        this.userRepo = userRepo;
    }

    public SharedFile uploadFile(Integer groupId, Integer userId, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        GroupChat groupChat = groupChatRepo.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found: " + groupId));
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        // Create directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (Files.notExists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Save file
        String originalFilename = file.getOriginalFilename();
        String cleanFilename = originalFilename != null
                ? originalFilename.replace(" ", "_")
                : "file";
        String storedFileName = System.currentTimeMillis() + "_" + cleanFilename;
        Path filePath = uploadPath.resolve(storedFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = "/uploads/groups/" + storedFileName;

        // Create SharedFile entity
        SharedFile sharedFile = new SharedFile();
        sharedFile.setGroupChat(groupChat);
        sharedFile.setUploadedBy(user);
        sharedFile.setFileName(originalFilename);
        sharedFile.setFileUrl(fileUrl);

        return sharedFileRepo.save(sharedFile);
    }

    public List<SharedFile> getFilesByGroup(Integer groupId) {
        return sharedFileRepo.findByGroupIdOrderByUploadTimeDesc(groupId);
    }

    public void deleteFile(Integer fileId) {
        SharedFile sharedFile = sharedFileRepo.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found: " + fileId));
        
        // Delete physical file
        try {
            Path filePath = Paths.get("uploads/groups/" + sharedFile.getFileUrl().replace("/uploads/groups/", ""));
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log error but continue with database deletion
            System.err.println("Error deleting file: " + e.getMessage());
        }
        
        sharedFileRepo.delete(sharedFile);
    }
}

