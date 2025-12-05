package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.dto.BookmarkDto;
import com.appdevg4.bcd.teknotes.entity.Bookmark;
import com.appdevg4.bcd.teknotes.service.BookmarkService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookmarks")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BookmarkController {

    private final BookmarkService service;

    public BookmarkController(BookmarkService service) {
        this.service = service;
    }

    @PostMapping
    public BookmarkDto create(@RequestBody Bookmark bookmark) {
        Bookmark created = service.create(bookmark);
        return BookmarkDto.from(created);
    }

    @GetMapping
    public List<BookmarkDto> getAll() {
        return service.findAll().stream()
                .map(BookmarkDto::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public BookmarkDto getById(@PathVariable Integer id) {
        Bookmark bookmark = service.findById(id);
        return BookmarkDto.from(bookmark);
    }

    @PutMapping("/{id}")
    public BookmarkDto update(@PathVariable Integer id, @RequestBody Bookmark bookmark) {
        Bookmark updated = service.update(id, bookmark);
        return BookmarkDto.from(updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/user/{userId}")
    public List<BookmarkDto> getUserBookmarks(@PathVariable Integer userId) {
        return service.findByUserId(userId).stream()
                .map(BookmarkDto::from)
                .collect(Collectors.toList());
    }

    @GetMapping("/check/{userId}/{resourceId}")
    public boolean isBookmarked(@PathVariable Integer userId, @PathVariable Integer resourceId) {
        return service.findByUserIdAndResourceId(userId, resourceId) != null;
    }

    @PostMapping("/toggle")
    public BookmarkDto toggleBookmark(@RequestBody java.util.Map<String, Integer> request) {
        Integer userId = request.get("userId");
        Integer resourceId = request.get("resourceId");
        Bookmark bookmark = service.createOrToggle(userId, resourceId);
        return bookmark != null ? BookmarkDto.from(bookmark) : null;
    }
}
