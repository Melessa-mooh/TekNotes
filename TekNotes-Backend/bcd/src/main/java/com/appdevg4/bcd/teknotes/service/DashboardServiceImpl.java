package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.dto.DashboardResponse;
import com.appdevg4.bcd.teknotes.dto.ResourceSummaryDto;
import com.appdevg4.bcd.teknotes.entity.Bookmark;
import com.appdevg4.bcd.teknotes.entity.Resource;
import com.appdevg4.bcd.teknotes.repository.BookmarkRepository;
import com.appdevg4.bcd.teknotes.repository.ResourceRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ResourceRepository resourceRepo;
    private final BookmarkRepository bookmarkRepo;

    public DashboardServiceImpl(ResourceRepository resourceRepo,
                                BookmarkRepository bookmarkRepo) {
        this.resourceRepo = resourceRepo;
        this.bookmarkRepo = bookmarkRepo;
    }

    @Override
    public DashboardResponse getOverview(Integer userId) {
        DashboardResponse res = new DashboardResponse();

        // top stats
        res.setUploadedNotes(resourceRepo.countUploadedByUser(userId));
        res.setBookmarked(bookmarkRepo.countByUserId(userId));
        res.setTotalDownloads(0); // TODO: hook to real downloads later

        // recent uploads
        List<Resource> recentUploads =
                resourceRepo.findRecentUploads(userId, PageRequest.of(0, 5));
        res.setRecentUploads(
                recentUploads.stream()
                        .map(ResourceSummaryDto::from)
                        .collect(Collectors.toList())
        );

        // recent downloads – for now, just show recent bookmarks as "downloads"
        List<Bookmark> recentBookmarks =
                bookmarkRepo.findRecentBookmarks(userId, PageRequest.of(0, 5));
        res.setRecentDownloads(
                recentBookmarks.stream()
                        .map(b -> ResourceSummaryDto.from(b.getResource()))
                        .collect(Collectors.toList())
        );

        return res;
    }
}