package com.appdevg4.bcd.teknotes.repository;

import com.appdevg4.bcd.teknotes.entity.Bookmark;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookmarkRepository extends JpaRepository<Bookmark, Integer> {
    // count how many bookmarks the user has
    @Query("select count(b) from Bookmark b where b.user.userId = :userId")
    long countByUserId(@Param("userId") Integer userId);

    // recent bookmarks of a user (for 'Recent Downloads' list)
    @Query("select b from Bookmark b where b.user.userId = :userId order by b.saveDate desc")
    List<Bookmark> findRecentBookmarks(@Param("userId") Integer userId, Pageable pageable);
}