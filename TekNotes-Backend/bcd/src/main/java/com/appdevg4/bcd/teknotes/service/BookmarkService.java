package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.entity.Bookmark;
import com.appdevg4.bcd.teknotes.repository.BookmarkRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookmarkService {

    private final BookmarkRepository repo;

    public BookmarkService(BookmarkRepository repo) {
        this.repo = repo;
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
}
