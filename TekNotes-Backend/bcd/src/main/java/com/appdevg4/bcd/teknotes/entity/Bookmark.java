package com.appdevg4.bcd.teknotes.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookmarks")
public class Bookmark {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookmarkId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "resource_id")
    private Resource resource;

    @Column(nullable = false)
    private LocalDateTime saveDate;

    public Bookmark() {
        this.saveDate = LocalDateTime.now();
    }

    public Integer getBookmarkId() {
        return bookmarkId;
    }
    public void setBookmarkId(Integer bookmarkId) {
        this.bookmarkId = bookmarkId;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public Resource getResource() {
        return resource;
    }
    public void setResource(Resource resource) {
        this.resource = resource;
    }
    public LocalDateTime getSaveDate() {
        return saveDate;
    }
    public void setSaveDate(LocalDateTime saveDate) {
        this.saveDate = saveDate;
    }
}
