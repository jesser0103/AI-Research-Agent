package com.jasser.aiagent.scraper;

import com.jasser.aiagent.model.Platform;
import com.jasser.aiagent.model.ScrapedPost;

import java.util.List;

public interface PlatformScraper {
    Platform getPlatform();
    List<ScrapedPost> scrape();

}
