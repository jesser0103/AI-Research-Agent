package com.jasser.aiagent.controller;

import com.jasser.aiagent.model.TrendTopic;
import com.jasser.aiagent.service.TrendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trends")
@RequiredArgsConstructor

public class TrendController {
    private final TrendService trendService;
    @GetMapping
    public ResponseEntity<List<TrendTopic>> getTopTrends() {
        return ResponseEntity.ok(this.trendService.getTopTrend());

    }
    @GetMapping("/latest")
    public ResponseEntity<List<TrendTopic>> getLatestTrends() {
        return ResponseEntity.ok(this.trendService.getLatestTrend());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<TrendTopic>> getTrendsByCategory(
            @PathVariable
            final String category) {
        return ResponseEntity.ok(this.trendService.getTrendsByCategory(category));
    }

    @GetMapping("/platform/{platform}")
    public ResponseEntity<List<TrendTopic>> getTrendsByPlatform(
            @PathVariable
            final String platform) {
        return ResponseEntity.ok(this.trendService.getTrendsByCategory(platform));
    }
    @GetMapping("/stats")
    public ResponseEntity<Map<String,Object>> getTrendsByStats() {
        return ResponseEntity.ok(this.trendService.getDashboardStats());
    }


}
