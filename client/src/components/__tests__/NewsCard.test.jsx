import { render, screen } from '@testing-library/react';
import NewsCard from '../NewsCard';

const mockArticle = {
  title: 'Test Article',
  description: 'This is a test article description',
  url: 'https://example.com',
  urlToImage: 'https://example.com/image.jpg',
  publishedAt: '2024-03-20T12:00:00Z',
  source: {
    name: 'Test Source'
  }
};

describe('NewsCard Component', () => {
  it('renders article information correctly', () => {
    render(<NewsCard article={mockArticle} />);
    
    expect(screen.getByText('Test Article')).toBeInTheDocument();
    expect(screen.getByText('This is a test article description')).toBeInTheDocument();
    expect(screen.getByText('Test Source')).toBeInTheDocument();
    expect(screen.getByText('March 20, 2024')).toBeInTheDocument();
  });

  it('renders image with correct alt text', () => {
    render(<NewsCard article={mockArticle} />);
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Article');
  });

  it('renders link with correct href', () => {
    render(<NewsCard article={mockArticle} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('handles missing image gracefully', () => {
    const articleWithoutImage = { ...mockArticle, urlToImage: null };
    render(<NewsCard article={articleWithoutImage} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
}); 