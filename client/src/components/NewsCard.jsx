import { useState } from 'react';
import { BookmarkIcon, BookmarkSlashIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

const NewsCard = ({ article, onSave }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sentimentColor = {
    'Bearish': 'bg-red-50 border-red-200 text-red-800',
    'Neutral': 'bg-gray-50 border-gray-200 text-gray-800',
    'Bullish': 'bg-green-50 border-green-200 text-green-800',
    'Somewhat-Bullish': 'bg-green-50/50 border-green-200 text-green-700',
    'Somewhat-Bearish': 'bg-red-50/50 border-red-200 text-red-700'
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

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(article.url);
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-200 ${
        isHovered ? 'scale-[1.02]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {article.banner_image && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={article.banner_image} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-4 right-4">
            <button
              onClick={handleSave}
              className="bg-white/90 hover:bg-white p-2 rounded-full shadow-sm transition-all duration-200 hover:scale-110"
            >
              {isSaved ? (
                <BookmarkSlashIcon className="h-5 w-5 text-blue-500" />
              ) : (
                <BookmarkIcon className="h-5 w-5 text-gray-500 hover:text-blue-500" />
              )}
            </button>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="text-xl font-semibold text-gray-800 leading-tight">{article.title}</h3>
          <span className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${sentimentColor[article.overall_sentiment_label] || 'bg-gray-50'}`}>
            {article.overall_sentiment_label}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span className="font-medium text-gray-700">{article.source}</span>
          <span className="mx-2">•</span>
          <span>{formatDate(article.time_published)}</span>
        </div>

        <p className="text-gray-600 mb-6 line-clamp-3">{article.summary}</p>

        {article.ticker_sentiment && article.ticker_sentiment.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {article.ticker_sentiment.map((ticker, index) => (
              <span 
                key={index} 
                className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full font-medium"
              >
                {ticker.ticker}: {ticker.ticker_sentiment_label}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 group"
          >
            Read full article
            <ArrowTopRightOnSquareIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <div className="flex items-center gap-2">
            {article.authors && article.authors.length > 0 && (
              <span className="text-sm text-gray-500">
                By {article.authors.join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
  