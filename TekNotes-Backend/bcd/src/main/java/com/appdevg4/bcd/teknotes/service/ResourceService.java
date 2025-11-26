package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.entity.Resource;
import com.appdevg4.bcd.teknotes.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository repo;

    public ResourceService(ResourceRepository repo) {
        this.repo = repo;
    }

    public Resource create(Resource resource) {
        return repo.save(resource);
    }

    public List<Resource> findAll() {
        return repo.findAll();
    }

    public Resource findById(Integer id) {
        return repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found: " + id));
    }

    public Resource update(Integer id, Resource updated) {
        Resource r = findById(id);
        r.setTitle(updated.getTitle());
        r.setFileUrl(updated.getFileUrl());
        r.setTagName(updated.getTagName());
        r.setTagDescription(updated.getTagDescription());
        r.setUploader(updated.getUploader());
        r.setCourse(updated.getCourse());
        r.setCreatedAt(updated.getCreatedAt());
        return repo.save(r);
    }

    public void delete(Integer id) {
        repo.deleteById(id);
    }
}
