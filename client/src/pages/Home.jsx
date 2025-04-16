import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-6">Welcome to Financial News</h1>
      <p className="text-xl mb-8 max-w-2xl mx-auto">
        Stay updated with the latest market news, trends, and sentiment analysis from global financial markets.
      </p>
      <div className="flex justify-center space-x-4">
        <Link 
          to="/register" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium"
        >
          Get Started
        </Link>
        <Link 
          to="/news" 
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg text-lg font-medium"
        >
          Browse News
        </Link>
      </div>
    </div>
  );
};

export default Home;
