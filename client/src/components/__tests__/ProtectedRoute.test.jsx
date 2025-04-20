import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { AuthProvider } from '../../context/AuthContext';

const TestComponent = () => <div>Protected Content</div>;

const renderProtectedRoute = (isAuthenticated = false, isLoading = false) => {
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <AuthProvider value={{ isAuthenticated, isLoading }}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <TestComponent />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('ProtectedRoute Component', () => {
  it('renders loading spinner when loading', () => {
    renderProtectedRoute(false, true);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    renderProtectedRoute(false, false);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders protected content when authenticated', () => {
    renderProtectedRoute(true, false);
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
}); 