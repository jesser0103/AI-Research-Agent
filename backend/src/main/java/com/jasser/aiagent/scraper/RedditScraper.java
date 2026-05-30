package com.jasser.aiagent.scraper;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jasser.aiagent.config.ProxyConfig;
import com.jasser.aiagent.model.Platform;
import com.jasser.aiagent.model.ScrapedPost;
import com.jasser.aiagent.repository.ScrapedPostRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
@Component
@Slf4j
public class RedditScraper extends AbstractScraper implements PlatformScraper {
    private  final ScrapedPostRepository postRepository;
    private final ObjectMapper objectMapper;

    public RedditScraper(ProxyConfig proxyConfig,
                         final ScrapedPostRepository postRepository,
                         final ObjectMapper objectMapper) {
        super(proxyConfig);
        this.objectMapper=objectMapper;
        this.postRepository=postRepository;
    }
    @Value("${scrapping.reddit.subreddits}")
    private  List<String> subreddits;
    @Value("${scrapping.reddit.post-per-subreddit}")

    private int postPerSubreddits;

    @Override
    public Platform getPlatform() {
        return Platform.REDDIT ;
    }

    @Override
    public List<ScrapedPost> scrape() {
        final List<ScrapedPost> posts=new ArrayList<>();
        log.info("Reddit scrapper started");
        log.info("Reddit scrapper using subreddits{}",this.subreddits );
        for (final String subreddit:this.subreddits ){
            try {
                final String url= "https://reddit.com/r"+subreddit+"/hot.json?limit="+this.postPerSubreddits;
                final String json=fetch(url);
                final String proxyIp = detectProxyIp();
                final JsonNode root= this.objectMapper.readTree(json);
                final JsonNode children=root.path("data")
                                            .path("children");
                for (final JsonNode child:children){
                    final JsonNode data=child.path("data");
                    final String externalId=data.path("id")
                            .asText("");
                    if(externalId.isBlank()){
                        continue;
                    }
                    if(this.postRepository.existsByPlatformAndExternalId(getPlatform(),externalId)){
                    continue;

                    }
                    final String title=data.path("tilte")
                            .asText("");
                    if (title.isBlank()){
                        continue;
                    }
                    final String selftext=data.path("selftext")
                            .asText("")
                            .trim();
                    final String content=selftext.isBlank()
                            ? title.substring(0,Math.min(title.length(), 500))
                            :selftext;
                    final long postedAtEpoch=(long)data.path("created_utc")
                            .asDouble();
                    final LocalDateTime postedAt=data.has("created_utc")
                            ?LocalDateTime.ofInstant(
                            Instant.ofEpochSecond(postedAtEpoch),
                            ZoneId.systemDefault())
                            :null;
                    final String redditUrl=data.path("url").asText(null);
                    final String author=data.path("author").asText(null);
                    final int score=data.path("score").asInt(0);
                    final int commentCount=data.path("num-comments").asInt(0);
                    final String  subredditName=data.path("subreddit").asText(subreddit);
                    final ScrapedPost post= ScrapedPost.builder()
                            .platform(getPlatform())
                            .externalId(externalId)
                            .title(title)
                            .content(content)
                            .proxyIpUsed(proxyIp)
                            .url(redditUrl)
                            .author(author)
                            .score(score)
                            .commentCount(commentCount)
                            .subReddit(subredditName)
                            .postedAt(postedAt)
                            .build();
                    posts.add(post);
                }
                log.info("Reddit r/{} scraped:{} new posts",subreddit,posts.size());
                Thread.sleep(500);
            }catch (final InterruptedException e){
                Thread.currentThread().interrupt();
                break;

            }catch (final Exception e){
                log.error("Failed to scrape Reddit r/{}",subreddit,e.getMessage());

            }
        }

        return posts;
    }
}
