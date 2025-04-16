const NewsFilter = ({ filters, setFilters }) => {
    const topics = [
      { value: 'blockchain', label: 'Blockchain' },
      { value: 'earnings', label: 'Earnings' },
      { value: 'ipo', label: 'IPO' },
      { value: 'mergers_and_acquisitions', label: 'M&A' },
      { value: 'financial_markets', label: 'Financial Markets' },
      { value: 'economy_fiscal', label: 'Fiscal Policy' },
      { value: 'economy_monetary', label: 'Monetary Policy' },
      { value: 'technology', label: 'Technology' }
    ];
  
    return (
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tickers (e.g., AAPL,MSFT)</label>
            <input
              type="text"
              value={filters.tickers}
              onChange={(e) => setFilters({...filters, tickers: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="AAPL,MSFT"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topics</label>
            <select
              value={filters.topics}
              onChange={(e) => setFilters({...filters, topics: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="">All Topics</option>
              {topics.map((topic) => (
                <option key={topic.value} value={topic.value}>{topic.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
            <input
              type="date"
              value={filters.time_from}
              onChange={(e) => setFilters({...filters, time_from: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({...filters, sort: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="LATEST">Latest</option>
              <option value="EARLIEST">Earliest</option>
              <option value="RELEVANCE">Relevance</option>
            </select>
          </div>
        </div>
      </div>
    );
  };
  
  export default NewsFilter;
  