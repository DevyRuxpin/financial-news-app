const NewsCard = ({ article, onSave }) => {
    const sentimentColor = {
      'Bearish': 'bg-red-100 border-red-300',
      'Neutral': 'bg-gray-100 border-gray-300',
      'Bullish': 'bg-green-100 border-green-300',
      'Somewhat-Bullish': 'bg-green-50 border-green-200',
      'Somewhat-Bearish': 'bg-red-50 border-red-200'
    };

    // Format the date from the API response
    const formatDate = (dateStr) => {
      try {
        // The date format from API is YYYYMMDDTHHMMSS
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const hour = dateStr.substring(9, 11);
        const minute = dateStr.substring(11, 13);
        return new Date(`${year}-${month}-${day}T${hour}:${minute}`).toLocaleString();
      } catch (e) {
        return 'Date not available';
      }
    };
  
    return (
      <div className={`border rounded-lg p-6 mb-6 shadow-md ${sentimentColor[article.overall_sentiment_label] || 'bg-white'}`}>
        <div className="flex flex-col md:flex-row gap-4">
          {article.banner_image && (
            <div className="md:w-1/3">
              <img 
                src={article.banner_image} 
                alt={article.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
          <div className={`flex-1 ${article.banner_image ? 'md:w-2/3' : ''}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-800">{article.title}</h3>
              <span className={`px-3 py-1 text-sm rounded-full ${
                article.overall_sentiment_label === 'Bullish' ? 'bg-green-200 text-green-800' :
                article.overall_sentiment_label === 'Bearish' ? 'bg-red-200 text-red-800' :
                article.overall_sentiment_label === 'Somewhat-Bullish' ? 'bg-green-100 text-green-700' :
                article.overall_sentiment_label === 'Somewhat-Bearish' ? 'bg-red-100 text-red-700' :
                'bg-gray-200 text-gray-800'
              }`}>
                {article.overall_sentiment_label}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <span className="mr-2">{article.source}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(article.time_published)}</span>
            </div>

            <p className="text-gray-700 mb-4">{article.summary}</p>

            {article.ticker_sentiment && article.ticker_sentiment.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.ticker_sentiment.map((ticker, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {ticker.ticker}: {ticker.ticker_sentiment_label}
                  </span>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-medium"
              >
                Read full article
              </a>
              <button 
                onClick={() => onSave(article.url)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Save Article
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default NewsCard;
  