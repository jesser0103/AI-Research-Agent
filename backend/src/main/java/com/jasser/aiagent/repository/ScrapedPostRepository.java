package com.jasser.aiagent.repository;

import com.jasser.aiagent.model.Platform;
import com.jasser.aiagent.model.ScrapedPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ScrapedPostRepository  extends JpaRepository<ScrapedPost,Long> {
    boolean existsByPlatformAndExternalId(Platform platform, String externalId);

    Object countByPlatform(Platform platform);

    List<ScrapedPost> findByScrapedAtAfterOrderByScoreDesc(LocalDateTime since);

    List<ScrapedPost> findByPlatformOrderByScrapedAtDesc(Platform platform);

    List<ScrapedPost> findTop20ByOrderByScrapedAtDesc();
}
