import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../../context/AuthContext';
import axios from 'axios';

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form', () => {
    renderLogin();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText("Don't have an account? Sign up")).toBeInTheDocument();
  });

  it('shows validation errors for empty form submission', async () => {
    renderLogin();
    fireEvent.click(screen.getByText('Sign in'));
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    renderLogin();
    const emailInput = screen.getByPlaceholderText('Email address');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    });
  });

  it('shows validation error for short password', async () => {
    renderLogin();
    const passwordInput = screen.getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.blur(passwordInput);
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    const mockUser = { id: 1, email: 'test@test.com' };
    const mockToken = 'test-token';
    axios.post.mockResolvedValueOnce({
      data: { user: mockUser, token: mockToken }
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
        email: 'test@test.com',
        password: 'password123'
      });
    });
  });

  it('handles login error', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } }
    });

    renderLogin();

    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: 'test@test.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });
}); 