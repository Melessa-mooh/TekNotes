package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.entity.Bookmark;
import com.appdevg4.bcd.teknotes.entity.Resource;
import com.appdevg4.bcd.teknotes.entity.User;
import com.appdevg4.bcd.teknotes.repository.BookmarkRepository;
import com.appdevg4.bcd.teknotes.repository.ResourceRepository;
import com.appdevg4.bcd.teknotes.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookmarkService {

    private final BookmarkRepository repo;
    private final UserRepository userRepo;
    private final ResourceRepository resourceRepo;

    public BookmarkService(BookmarkRepository repo, 
                          UserRepository userRepo,
                          ResourceRepository resourceRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.resourceRepo = resourceRepo;
    }

    public Bookmark create(Bookmark bookmark) {
        return repo.save(bookmark);
    }

    public List<Bookmark> findAll() {
        return repo.findAll();
    }

    public Bookmark findById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Bookmark not found: " + id));
    }

    public Bookmark update(Integer id, Bookmark updated) {
        Bookmark b = findById(id);
        b.setUser(updated.getUser());
        b.setResource(updated.getResource());
        b.setSaveDate(updated.getSaveDate());
        return repo.save(b);
    }

    public void delete(Integer id) {
        repo.deleteById(id);
    }

    public List<Bookmark> findByUserId(Integer userId) {
        return repo.findByUserId(userId);
    }

    public Bookmark findByUserIdAndResourceId(Integer userId, Integer resourceId) {
        List<Bookmark> bookmarks = repo.findByUserIdAndResourceId(userId, resourceId);
        return bookmarks.isEmpty() ? null : bookmarks.get(0);
    }

    public Bookmark createOrToggle(Integer userId, Integer resourceId) {
        Bookmark existing = findByUserIdAndResourceId(userId, resourceId);
        if (existing != null) {
            // If exists, delete it (toggle off)
            repo.delete(existing);
            return null;
        } else {
            // Create new bookmark
            User user = userRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));
            Resource resource = resourceRepo.findById(resourceId)
                    .orElseThrow(() -> new RuntimeException("Resource not found: " + resourceId));
            
            Bookmark bookmark = new Bookmark();
            bookmark.setUser(user);
            bookmark.setResource(resource);
            return repo.save(bookmark);
        }
    }
}
