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
      <div className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-800">{article.title}</h3>
              <button
                onClick={handleSave}
                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all duration-200"
              >
                {isSaved ? (
                  <BookmarkSlashIcon className="h-5 w-5 text-blue-500" />
                ) : (
                  <BookmarkIcon className="h-5 w-5 text-gray-500 hover:text-blue-500" />
                )}
              </button>
            </div>
            
            <p className="text-gray-600 mb-4">{article.summary}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {article.tickers && article.tickers.map((ticker, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
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
                <span className="text-sm text-gray-500">
                  {formatDate(article.time_published)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
  