package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.entity.Resource;
import com.appdevg4.bcd.teknotes.service.ResourceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin
public class ResourceController {

    private final ResourceService service;

    public ResourceController(ResourceService service) {
        this.service = service;
    }

    @PostMapping
    public Resource create(@RequestBody Resource resource) {
        return service.create(resource);
    }

    @GetMapping
    public List<Resource> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Resource getById(@PathVariable Integer id) {
        return service.findById(id);
    }

    @PutMapping("/{id}")
    public Resource update(@PathVariable Integer id, @RequestBody Resource resource) {
        return service.update(id, resource);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        service.delete(id);
    }
}
