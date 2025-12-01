package com.appdevg4.bcd.teknotes.service;

import com.appdevg4.bcd.teknotes.dto.DashboardResponse;

public interface DashboardService {
    DashboardResponse getOverview(Integer userId);
}