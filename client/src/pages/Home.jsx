import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Financial News</h1>
        <p className="text-xl mb-12 text-gray-600">
          Stay updated with the latest market news, trends, and sentiment analysis from global financial markets.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link 
            to="/register" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            Get Started
          </Link>
          <Link 
            to="/news" 
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
          >
            Browse News
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
