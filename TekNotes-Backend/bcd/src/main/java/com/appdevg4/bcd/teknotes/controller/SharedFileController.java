package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.dto.SharedFileDto;
import com.appdevg4.bcd.teknotes.entity.SharedFile;
import com.appdevg4.bcd.teknotes.service.SharedFileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shared-files")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class SharedFileController {

    private final SharedFileService service;

    public SharedFileController(SharedFileService service) {
        this.service = service;
    }

    @PostMapping("/upload")
    public ResponseEntity<SharedFileDto> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("groupId") Integer groupId,
            @RequestParam("userId") Integer userId) {
        try {
            SharedFile sharedFile = service.uploadFile(groupId, userId, file);
            return ResponseEntity.status(HttpStatus.CREATED).body(SharedFileDto.from(sharedFile));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/group/{groupId}")
    public ResponseEntity<List<SharedFileDto>> getFilesByGroup(@PathVariable Integer groupId) {
        try {
            List<SharedFileDto> files = service.getFilesByGroup(groupId).stream()
                    .map(SharedFileDto::from)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Integer fileId) {
        try {
            service.deleteFile(fileId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}

