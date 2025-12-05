package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.dto.DownloadDto;
import com.appdevg4.bcd.teknotes.dto.ResourceSummaryDto;
import com.appdevg4.bcd.teknotes.entity.Download;
import com.appdevg4.bcd.teknotes.service.DownloadService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/downloads")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class DownloadController {

    private final DownloadService service;

    public DownloadController(DownloadService service) {
        this.service = service;
    }

    @PostMapping
    public DownloadDto create(@RequestBody Map<String, Integer> request) {
        Integer userId = request.get("userId");
        Integer resourceId = request.get("resourceId");
        Download download = service.create(userId, resourceId);
        return DownloadDto.from(download);
    }

    @GetMapping
    public List<DownloadDto> getAll() {
        return service.findAll().stream()
                .map(DownloadDto::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public DownloadDto getById(@PathVariable Integer id) {
        Download download = service.findById(id);
        return DownloadDto.from(download);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/user/{userId}")
    public List<Map<String, Object>> getUserDownloads(@PathVariable Integer userId) {
        List<Download> downloads = service.findByUserId(userId);
        return downloads.stream()
                .map(d -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", d.getDownloadId());
                    map.put("downloadDate", d.getDownloadDate());
                    map.put("resource", ResourceSummaryDto.from(d.getResource()));
                    return map;
                })
                .collect(Collectors.toList());
    }

    @PostMapping("/shared-file")
    public DownloadDto createFromSharedFile(@RequestBody Map<String, Object> request) {
        try {
            // Handle different number types from JSON
            Integer userId = null;
            Object userIdObj = request.get("userId");
            if (userIdObj != null) {
                if (userIdObj instanceof Integer) {
                    userId = (Integer) userIdObj;
                } else if (userIdObj instanceof Number) {
                    userId = ((Number) userIdObj).intValue();
                }
            }

            String fileUrl = (String) request.get("fileUrl");
            String fileName = (String) request.get("fileName");
            
            Integer uploadedByUserId = null;
            Object uploadedByObj = request.get("uploadedByUserId");
            if (uploadedByObj != null) {
                if (uploadedByObj instanceof Integer) {
                    uploadedByUserId = (Integer) uploadedByObj;
                } else if (uploadedByObj instanceof Number) {
                    uploadedByUserId = ((Number) uploadedByObj).intValue();
                }
            }

            if (userId == null) {
                throw new RuntimeException("userId is required");
            }
            if (fileUrl == null || fileUrl.isEmpty()) {
                throw new RuntimeException("fileUrl is required");
            }

            Download download = service.createFromSharedFile(userId, fileUrl, fileName, uploadedByUserId);
            return DownloadDto.from(download);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to create download from shared file: " + e.getMessage(), e);
        }
    }
}

