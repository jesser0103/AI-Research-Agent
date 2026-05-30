package com.jasser.aiagent.repository;

import com.jasser.aiagent.model.Platform;
import com.jasser.aiagent.model.TrendTopic;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TrendTopicRepository extends JpaRepository<TrendTopic,Long> {
    List<TrendTopic> findByDetectedAtAfterOrderByTrendScoreDesc(LocalDateTime since);

    List<TrendTopic> findTop20ByOrderByTrendScoreDesc();

    List<TrendTopic> findByCategoryOrderByTrendScoreDesc(String category);

    List<TrendTopic> findByPrimaryPlatformOrderByTrendScoreDesc(String platform);
}
