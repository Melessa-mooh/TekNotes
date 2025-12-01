package com.appdevg4.bcd.teknotes.controller;

import com.appdevg4.bcd.teknotes.dto.DashboardResponse;
import com.appdevg4.bcd.teknotes.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/overview")
    public DashboardResponse getOverview(@RequestParam Integer userId) {
        return dashboardService.getOverview(userId);
    }
}