package com.appdevg4.bcd.teknotes.dto;

import com.appdevg4.bcd.teknotes.entity.SharedFile;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter
public class SharedFileDto {
    private Integer fileId;
    private Integer groupId;
    private Integer uploadedByUserId;
    private String uploadedByName;
    private String fileName;
    private String fileUrl;
    private LocalDateTime uploadTime;

    public static SharedFileDto from(SharedFile sharedFile) {
        SharedFileDto dto = new SharedFileDto();
        dto.fileId = sharedFile.getFileId();
        dto.groupId = sharedFile.getGroupChat().getGroupId();
        dto.uploadedByUserId = sharedFile.getUploadedBy().getUserId();
        dto.uploadedByName = sharedFile.getUploadedBy().getFirstName() + " " + sharedFile.getUploadedBy().getLastName();
        dto.fileName = sharedFile.getFileName();
        dto.fileUrl = sharedFile.getFileUrl();
        dto.uploadTime = sharedFile.getUploadTime();
        return dto;
    }
}

