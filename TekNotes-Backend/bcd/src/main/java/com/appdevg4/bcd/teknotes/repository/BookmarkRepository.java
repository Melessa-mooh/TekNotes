package com.appdevg4.bcd.teknotes.repository;

import com.appdevg4.bcd.teknotes.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookmarkRepository extends JpaRepository<Bookmark, Integer> {
}
