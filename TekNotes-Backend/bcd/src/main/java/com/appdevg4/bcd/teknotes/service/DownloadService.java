package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.entity.Download;
import com.appdevg4.bcd.teknotes.entity.Resource;
import com.appdevg4.bcd.teknotes.entity.User;
import com.appdevg4.bcd.teknotes.repository.DownloadRepository;
import com.appdevg4.bcd.teknotes.repository.ResourceRepository;
import com.appdevg4.bcd.teknotes.repository.UserRepository;
import com.appdevg4.bcd.teknotes.service.ResourceService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DownloadService {

    private final DownloadRepository downloadRepo;
    private final UserRepository userRepo;
    private final ResourceRepository resourceRepo;
    private final ResourceService resourceService;

    public DownloadService(DownloadRepository downloadRepo,
                          UserRepository userRepo,
                          ResourceRepository resourceRepo,
                          ResourceService resourceService) {
        this.downloadRepo = downloadRepo;
        this.userRepo = userRepo;
        this.resourceRepo = resourceRepo;
        this.resourceService = resourceService;
    }

    public Download create(Integer userId, Integer resourceId) {
        // Check if download already exists (including deleted ones)
        List<Download> existing = downloadRepo.findByUserIdAndResourceId(userId, resourceId);
        if (!existing.isEmpty()) {
            Download existingDownload = existing.get(0);
            // If it was deleted, restore it
            if ("DELETED".equals(existingDownload.getStatus())) {
                existingDownload.setStatus("ACTIVE");
                existingDownload.setDownloadDate(java.time.LocalDateTime.now());
                return downloadRepo.save(existingDownload);
            }
            // Return existing active download (don't create duplicate)
            return existingDownload;
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        Resource resource = resourceRepo.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found: " + resourceId));

        Download download = new Download();
        download.setUser(user);
        download.setResource(resource);
        download.setStatus("ACTIVE");
        return downloadRepo.save(download);
    }

    public List<Download> findAll() {
        return downloadRepo.findAllActive();
    }

    public Download findById(Integer id) {
        Download download = downloadRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Download not found: " + id));
        // Only return if not deleted
        if ("DELETED".equals(download.getStatus())) {
            throw new RuntimeException("Download not found: " + id);
        }
        return download;
    }

    public void delete(Integer id) {
        Download download = downloadRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Download not found: " + id));
        // Soft delete - mark as DELETED instead of removing
        download.setStatus("DELETED");
        downloadRepo.save(download);
    }

    public List<Download> findByUserId(Integer userId) {
        return downloadRepo.findByUserId(userId);
    }

    public Download createFromSharedFile(Integer userId, String fileUrl, String fileName, Integer uploadedByUserId) {
        if (userId == null) {
            throw new RuntimeException("User ID is required");
        }
        if (fileUrl == null || fileUrl.isEmpty()) {
            throw new RuntimeException("File URL is required");
        }

        // Use uploadedByUserId if provided, otherwise use userId (downloader)
        Integer uploaderId = uploadedByUserId != null ? uploadedByUserId : userId;
        
        // Find or create a resource from the shared file
        Resource resource = resourceService.findOrCreateResourceFromSharedFile(
                fileUrl, 
                fileName != null ? fileName : "Shared File",
                uploaderId
        );

        // Now create the download using the resource
        return create(userId, resource.getResourceId());
    }
}

