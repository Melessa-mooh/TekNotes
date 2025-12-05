package com.appdevg4.bcd.teknotes.dto;

import com.appdevg4.bcd.teknotes.entity.Download;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class DownloadDto {
    private Integer id;
    private Integer userId;  // who downloaded
    private String userName; // downloader's name
    private Integer resourceId;
    private LocalDateTime downloadDate;
    private ResourceSummaryDto resource;

    public static DownloadDto from(Download download) {
        DownloadDto dto = new DownloadDto();
        dto.id = download.getDownloadId();
        dto.userId = download.getUser().getUserId();
        dto.userName = download.getUser().getFirstName() + " " + download.getUser().getLastName();
        dto.resourceId = download.getResource().getResourceId();
        dto.downloadDate = download.getDownloadDate();
        dto.resource = ResourceSummaryDto.from(download.getResource());
        return dto;
    }
}

