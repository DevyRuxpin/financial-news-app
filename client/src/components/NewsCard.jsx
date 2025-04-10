const NewsCard = ({ article, onSave }) => {
    const sentimentColor = {
      Bearish: 'bg-red-100 border-red-300',
      Neutral: 'bg-gray-100 border-gray-300',
      Bullish: 'bg-green-100 border-green-300'
    };
  
    return (
      <div className={`border rounded-lg p-4 mb-4 ${sentimentColor[article.overall_sentiment_label] || 'bg-white'}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{article.authors?.join(', ')}</p>
            <p className="text-sm mb-3">{article.summary}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {article.ticker_sentiment?.map((ticker, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {ticker.ticker}: {ticker.ticker_sentiment_label}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 mb-2">
              {new Date(article.time_published).toLocaleString()}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              article.overall_sentiment_label === 'Bullish' ? 'bg-green-200 text-green-800' :
              article.overall_sentiment_label === 'Bearish' ? 'bg-red-200 text-red-800' :
              'bg-gray-200 text-gray-800'
            }`}>
              {article.overall_sentiment_label}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-sm"
          >
            Read more
          </a>
          <button 
            onClick={() => onSave(article.url)}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </div>
    );
  };
  
  export default NewsCard;
  