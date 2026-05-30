package com.jasser.aiagent.scheduler;

import com.jasser.aiagent.model.Platform;
import com.jasser.aiagent.model.ScrapedPost;
import com.jasser.aiagent.repository.ScrapedPostRepository;
import com.jasser.aiagent.service.LlmAnalysisService;
import com.jasser.aiagent.service.ScrapingOrchestrator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class ResearchScheduler {
    private final ScrapingOrchestrator scrapingOrchestrator;
    private final ScrapedPostRepository postRepository;
    private final LlmAnalysisService analysisService;
    @Scheduled(cron= "${research.cron}")
    public void runResearchCycle(){
        log.info("===== Research cycle started ====");
        final Map<Platform,Integer> results=this.scrapingOrchestrator.scrapeAll();
        log.info("Scraping completed . Results: {}", results);
        final LocalDateTime since=LocalDateTime.now().minusHours(6);
        final List<ScrapedPost> recentPosts=this.postRepository.findByScrapedAtAfterOrderByScoreDesc(since);
        if(recentPosts.isEmpty()){
            this.analysisService.analyze(recentPosts);
            log.info("LLM analysis completed for {} posts", recentPosts.size());
        }
        log.info("===== Research cycle completed ====");

    }

}
