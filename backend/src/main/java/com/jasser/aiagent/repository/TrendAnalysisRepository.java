package com.jasser.aiagent.repository;

import com.jasser.aiagent.model.TrendAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrendAnalysisRepository extends JpaRepository<TrendAnalysis,Long> {
    Optional<TrendAnalysis> findTopByOrderByAnalyzedAtDesc();
}
