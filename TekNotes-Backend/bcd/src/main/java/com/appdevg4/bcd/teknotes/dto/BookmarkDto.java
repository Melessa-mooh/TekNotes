package com.appdevg4.bcd.teknotes.dto;

import com.appdevg4.bcd.teknotes.entity.Bookmark;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class BookmarkDto {
    private Integer id;
    private Integer userId;
    private Integer resourceId;
    private LocalDateTime saveDate;
    private ResourceSummaryDto resource;

    public static BookmarkDto from(Bookmark bookmark) {
        BookmarkDto dto = new BookmarkDto();
        dto.id = bookmark.getBookmarkId();
        dto.userId = bookmark.getUser().getUserId();
        dto.resourceId = bookmark.getResource().getResourceId();
        dto.saveDate = bookmark.getSaveDate();
        dto.resource = ResourceSummaryDto.from(bookmark.getResource());
        return dto;
    }
}

