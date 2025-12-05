package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.dto.DashboardResponse;
import com.appdevg4.bcd.teknotes.dto.ResourceSummaryDto;
import com.appdevg4.bcd.teknotes.entity.Download;
import com.appdevg4.bcd.teknotes.entity.Resource;
import com.appdevg4.bcd.teknotes.repository.BookmarkRepository;
import com.appdevg4.bcd.teknotes.repository.DownloadRepository;
import com.appdevg4.bcd.teknotes.repository.ResourceRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ResourceRepository resourceRepo;
    private final BookmarkRepository bookmarkRepo;
    private final DownloadRepository downloadRepo;

    public DashboardServiceImpl(ResourceRepository resourceRepo,
                                BookmarkRepository bookmarkRepo,
                                DownloadRepository downloadRepo) {
        this.resourceRepo = resourceRepo;
        this.bookmarkRepo = bookmarkRepo;
        this.downloadRepo = downloadRepo;
    }

    @Override
    public DashboardResponse getOverview(Integer userId) {
        DashboardResponse res = new DashboardResponse();

        // top stats
        res.setUploadedNotes(resourceRepo.countUploadedByUser(userId));
        res.setBookmarked(bookmarkRepo.countByUserId(userId));
        res.setTotalDownloads(downloadRepo.countByUserId(userId));

        // recent uploads - show ALL resources from ALL users
        List<Resource> recentUploads =
                resourceRepo.findAllRecentUploads(PageRequest.of(0, 10));
        res.setRecentUploads(
                recentUploads.stream()
                        .map(ResourceSummaryDto::from)
                        .collect(Collectors.toList())
        );

        // recent downloads – use real downloads
        List<Download> recentDownloads =
                downloadRepo.findRecentDownloads(userId, PageRequest.of(0, 5));
        res.setRecentDownloads(
                recentDownloads.stream()
                        .map(d -> ResourceSummaryDto.from(d.getResource()))
                        .collect(Collectors.toList())
        );

        return res;
    }
}