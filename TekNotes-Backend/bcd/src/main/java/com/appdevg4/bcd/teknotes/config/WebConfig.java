package com.appdevg4.bcd.teknotes.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve uploaded files from the uploads directory
        String uploadPath = Paths.get("uploads").toAbsolutePath().toString();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/");
        // Serve group shared files
        String groupsPath = Paths.get("uploads/groups").toAbsolutePath().toString();
        registry.addResourceHandler("/uploads/groups/**")
                .addResourceLocations("file:" + groupsPath + "/");
    }
}

