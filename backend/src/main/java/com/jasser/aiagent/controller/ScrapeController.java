package com.jasser.aiagent.controller;

import com.jasser.aiagent.model.Platform;
import com.jasser.aiagent.model.ScrapedPost;
import com.jasser.aiagent.model.TrendAnalysis;
import com.jasser.aiagent.repository.ScrapedPostRepository;
import com.jasser.aiagent.service.LlmAnalysisService;
import com.jasser.aiagent.service.ScrapingOrchestrator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/scrape")
@RequiredArgsConstructor

public class ScrapeController {
    private final ScrapingOrchestrator orchestrator;
    private final LlmAnalysisService analysisService;
    private final ScrapedPostRepository postRepository;
    @PostMapping("/run")
    public ResponseEntity<Map<String,Object>> triggerFullCycle() {
        final Map<Platform,Integer> scrapeResult =this.orchestrator.scrapeAll();
        final LocalDateTime since = LocalDateTime.now().minusDays(6);
        final List<ScrapedPost> posts=this.postRepository.findByScrapedAtAfterOrderByScoreDesc(since);
        TrendAnalysis analysis=null;
        if(!posts.isEmpty()){
            analysis=this.analysisService.analyze(posts);
        }
        return ResponseEntity.ok(
                Map.of("scrapeResult",scrapeResult,
                        "postsAnalyzed",posts.size(),
                        "analysisId",analysis!=null?analysis.getId():"none")
        );
    }
    @PostMapping("/platform/{platform}")
    public ResponseEntity<List<ScrapedPost>> scrapePlatform(
            @PathVariable final Platform platform) {
        return ResponseEntity.ok(this.orchestrator.scrapeByPlatform(platform));
    }
    @GetMapping("/posts ")
    public ResponseEntity<List<ScrapedPost>> getRecentPosts(
            @RequestParam(required = false)
            final Platform platform
    ){
        if(platform!=null){
            return ResponseEntity.ok(this.postRepository.findByPlatformOrderByScrapedAtDesc(platform));
        }
        return  ResponseEntity.ok(this.postRepository.findTop20ByOrderByScrapedAtDesc());
    }


}
