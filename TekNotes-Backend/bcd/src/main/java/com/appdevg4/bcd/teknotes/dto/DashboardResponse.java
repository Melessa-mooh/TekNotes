package com.appdevg4.bcd.teknotes.dto;

import java.util.List;

public class DashboardResponse {

    private long uploadedNotes;
    private long bookmarked;
    private long totalDownloads;

    private List<ResourceSummaryDto> recentUploads;
    private List<ResourceSummaryDto> recentDownloads;

    public long getUploadedNotes() {
        return uploadedNotes;
    }

    public void setUploadedNotes(long uploadedNotes) {
        this.uploadedNotes = uploadedNotes;
    }

    public long getBookmarked() {
        return bookmarked;
    }

    public void setBookmarked(long bookmarked) {
        this.bookmarked = bookmarked;
    }

    public long getTotalDownloads() {
        return totalDownloads;
    }

    public void setTotalDownloads(long totalDownloads) {
        this.totalDownloads = totalDownloads;
    }

    public List<ResourceSummaryDto> getRecentUploads() {
        return recentUploads;
    }

    public void setRecentUploads(List<ResourceSummaryDto> recentUploads) {
        this.recentUploads = recentUploads;
    }

    public List<ResourceSummaryDto> getRecentDownloads() {
        return recentDownloads;
    }

    public void setRecentDownloads(List<ResourceSummaryDto> recentDownloads) {
        this.recentDownloads = recentDownloads;
    }
}