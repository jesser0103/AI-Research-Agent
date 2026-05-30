package com.jasser.aiagent.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class AnthropicConfig {
    @Value("${anthropic.api-key}")
    private String apiKey;
    @Value("${anthropic.base-url}")
    private String baseUrl;
    @Value("${anthropic.version}")
    private String anthropicVersion;
    @Bean
    public WebClient anthropicWebClient() {
        return WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("x-api-key",apiKey)
                .defaultHeader("anthropic-version",anthropicVersion)
                .defaultHeader("content-type","application/json")
                .build();

    }
}
