# Financial News Dashboard

A sophisticated financial news aggregation platform that provides real-time market insights, sentiment analysis, and personalized news tracking. Built with modern web technologies and designed for both casual investors and financial professionals.

![Financial News Dashboard](https://via.placeholder.com/1200x600?text=Financial+News+Dashboard)

## 🌟 Features

- **Real-time Financial News**: Access the latest financial news from Alpha Vantage API
- **Sentiment Analysis**: Color-coded sentiment indicators (Bullish, Neutral, Bearish)
- **Advanced Filtering**: Filter news by tickers, topics, and time periods
- **Personalized Experience**: Save articles and create custom watchlists
- **Responsive Design**: Optimized for desktop and mobile devices
- **Mock Data Support**: Seamless fallback to mock data during API rate limits
- **Secure Authentication**: Protected routes and user-specific content

## 🛠️ Tech Stack

### Frontend
- **React.js**: Modern UI framework
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: Promise-based HTTP client
- **React Router**: Client-side routing
- **Context API**: State management

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **PostgreSQL**: Relational database
- **JWT**: Secure authentication
- **Alpha Vantage API**: Financial data integration

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/financial-news-app.git
cd financial-news-app
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
```bash
# Server (.env)
ALPHA_VANTAGE_API_KEY=your_api_key
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url

# Client (.env)
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development servers:
```bash
# Start server
cd server
npm run dev

# Start client
cd ../client
npm start
```

## 🔧 Configuration

### API Keys
- Obtain an [Alpha Vantage API key](https://www.alphavantage.co/support/#api-key)
- Configure your `.env` files with the necessary credentials

### Database Setup
1. Create a PostgreSQL database
2. Run the database migrations:
```bash
cd server
npm run migrate
```

## 🚀 Deployment

The application is configured for deployment on Render:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following environment variables:
   - `ALPHA_VANTAGE_API_KEY`
   - `JWT_SECRET`
   - `DATABASE_URL`
4. Deploy!

## 📚 API Documentation

### News Endpoints
- `GET /api/news`: Fetch financial news
  - Query Parameters:
    - `tickers`: Comma-separated stock symbols
    - `topics`: News topics
    - `time_from`: Start date
    - `sort`: Sort order (LATEST, EARLIEST)
    - `useMock`: Boolean to use mock data

- `POST /api/news/save`: Save an article
  - Body: `{ user_id, article_id }`

### Authentication Endpoints
- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User login
- `GET /api/auth/me`: Get current user

## 🎨 UI Components

- **NewsCard**: Displays individual news articles with sentiment indicators
- **NewsFilter**: Advanced filtering interface
- **AuthForm**: User authentication forms
- **Header/Footer**: Consistent navigation elements

## 🔒 Security Features

- JWT-based authentication
- Protected API routes
- Secure password hashing
- Rate limiting
- CORS configuration
- Environment variable protection

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (≥1024px)
- Tablet (≥768px)
- Mobile (≥320px)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Alpha Vantage for financial data
- React and Express.js communities
- All contributors and supporters
