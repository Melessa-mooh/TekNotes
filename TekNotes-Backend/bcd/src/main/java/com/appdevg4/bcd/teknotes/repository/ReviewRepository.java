package com.appdevg4.bcd.teknotes.repository;

import com.appdevg4.bcd.teknotes.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    
    @Query("SELECT r FROM Review r WHERE r.user.userId = :userId AND (r.status IS NULL OR r.status != 'DELETED')")
    List<Review> findByUser_UserId(@Param("userId") Integer userId); 
    
    @Query("SELECT r FROM Review r WHERE r.resource.resourceId = :resourceId AND (r.status IS NULL OR r.status != 'DELETED')")
    List<Review> findByResource_ResourceId(@Param("resourceId") Integer resourceId);

    @Query("SELECT r FROM Review r WHERE r.status IS NULL OR r.status != 'DELETED'")
    List<Review> findAllActive();
}
//review