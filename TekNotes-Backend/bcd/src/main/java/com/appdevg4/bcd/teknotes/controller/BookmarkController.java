package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.entity.Bookmark;
import com.appdevg4.bcd.teknotes.service.BookmarkService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookmarks")
@CrossOrigin(origins = "http://localhost:3000")
public class BookmarkController {

    private final BookmarkService service;

    public BookmarkController(BookmarkService service) {
        this.service = service;
    }

    @PostMapping
    public Bookmark create(@RequestBody Bookmark bookmark) {
        return service.create(bookmark);
    }

    @GetMapping
    public List<Bookmark> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Bookmark getById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public Bookmark update(@PathVariable Integer id, @RequestBody Bookmark bookmark) {
        return service.update(id, bookmark);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }

    @GetMapping("/user/{userId}")
    public List<Bookmark> getUserBookmarks(@PathVariable Integer userId) {
        // You may want to add a repository method to filter by userId
        return service.findAll();
    }
}
