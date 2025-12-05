package com.appdevg4.bcd.teknotes.repository;

import com.appdevg4.bcd.teknotes.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    
    List<Review> findByUser_UserId(Integer userId); 
    
  
    List<Review> findByResource_ResourceId(Integer resourceId);
}