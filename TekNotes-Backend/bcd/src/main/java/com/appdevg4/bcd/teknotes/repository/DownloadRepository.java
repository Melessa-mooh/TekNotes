package com.appdevg4.bcd.teknotes.repository;

import com.appdevg4.bcd.teknotes.entity.Download;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DownloadRepository extends JpaRepository<Download, Integer> {
    // count how many downloads the user has (excluding deleted)
    @Query("select count(d) from Download d where d.user.userId = :userId and (d.status IS NULL OR d.status != 'DELETED')")
    long countByUserId(@Param("userId") Integer userId);

    // recent downloads of a user (for 'Recent Downloads' list) - excluding deleted
    @Query("select d from Download d where d.user.userId = :userId and (d.status IS NULL OR d.status != 'DELETED') order by d.downloadDate desc")
    List<Download> findRecentDownloads(@Param("userId") Integer userId, Pageable pageable);

    // get all downloads for a user - excluding deleted
    @Query("select d from Download d where d.user.userId = :userId and (d.status IS NULL OR d.status != 'DELETED') order by d.downloadDate desc")
    List<Download> findByUserId(@Param("userId") Integer userId);

    // check if user has already downloaded a resource (including deleted ones for restoration)
    @Query("select d from Download d where d.user.userId = :userId and d.resource.resourceId = :resourceId")
    List<Download> findByUserIdAndResourceId(@Param("userId") Integer userId, @Param("resourceId") Integer resourceId);

    // find all downloads excluding deleted
    @Query("select d from Download d where d.status IS NULL OR d.status != 'DELETED'")
    List<Download> findAllActive();
}

