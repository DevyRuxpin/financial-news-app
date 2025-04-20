import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import axios from 'axios';

// Mock child component to test context
const TestComponent = () => {
  const { user, loading, error, login, register, logout } = useAuth();
  return (
    <div>
      <div data-testid="user">{user?.email}</div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="error">{error}</div>
      <button onClick={() => login('test@test.com', 'password')}>Login</button>
      <button onClick={() => register('test@test.com', 'password')}>Register</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should provide initial state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('');
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    expect(screen.getByTestId('error')).toHaveTextContent('');
  });

  it('should handle successful login', async () => {
    const mockUser = { id: 1, email: 'test@test.com' };
    const mockToken = 'test-token';
    axios.post.mockResolvedValueOnce({
      data: { user: mockUser, token: mockToken }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
    expect(screen.getByTestId('user')).toHaveTextContent(mockUser.email);
  });

  it('should handle login error', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Login').click();
    });

    expect(screen.getByTestId('error')).toHaveTextContent('Invalid credentials');
  });

  it('should handle successful registration', async () => {
    const mockUser = { id: 1, email: 'test@test.com' };
    const mockToken = 'test-token';
    axios.post.mockResolvedValueOnce({
      data: { user: mockUser, token: mockToken }
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Register').click();
    });

    expect(localStorage.setItem).toHaveBeenCalledWith('token', mockToken);
    expect(screen.getByTestId('user')).toHaveTextContent(mockUser.email);
  });

  it('should handle logout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      screen.getByText('Logout').click();
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(screen.getByTestId('user')).toHaveTextContent('');
  });
}); 