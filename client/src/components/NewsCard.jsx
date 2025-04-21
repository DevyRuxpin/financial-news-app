import { useState } from 'react';
import { BookmarkIcon, BookmarkSlashIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const NewsCard = ({ article, onSave, onDelete, isSaved }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const sentimentColor = getSentimentColor(article.sentiment);

  function getSentimentColor(sentiment) {
    switch (sentiment?.toLowerCase()) {
      case 'bullish':
        return 'bg-green-100 text-green-800';
      case 'bearish':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-gray-200 ${
        isHovered ? 'scale-[1.02]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${sentimentColor}`}>
                {article.sentiment}
              </span>
              {isSaved ? (
                <button
                  onClick={onDelete}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                  title="Remove from saved articles"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={onSave}
                  className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  title="Save article"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              )}
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-colors"
              >
                {article.title}
              </a>
            </h2>

            <div className="flex items-center text-sm text-gray-500 mb-4">
              <span>{formatDate(article.time_published)}</span>
            </div>

            <div className="text-gray-700 mb-4">
              {article.summary && (
                <p className={isExpanded ? '' : 'line-clamp-3'}>
                  {article.summary}
                </p>
              )}
              {article.summary && article.summary.length > 150 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {article.tickers && article.tickers.map((ticker, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                  {ticker}
                </span>
              ))}
              {article.topics && article.topics.map((topic, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                  {topic}
                </span>
              ))}
            </div>

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
      </div>
    </div>
  );
};

export default NewsCard;
  