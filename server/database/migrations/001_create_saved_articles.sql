CREATE TABLE IF NOT EXISTS saved_articles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    article_url VARCHAR(255) NOT NULL,
    article_title VARCHAR(255) NOT NULL,
    article_summary TEXT,
    article_sentiment VARCHAR(50),
    article_tickers TEXT[],
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, article_url)
);

CREATE INDEX IF NOT EXISTS idx_saved_articles_user_id ON saved_articles(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_articles_article_url ON saved_articles(article_url); 