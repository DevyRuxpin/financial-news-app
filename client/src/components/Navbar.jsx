import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Financial News</Link>
        
        <div className="flex space-x-4">
          {user ? (
            <>
              <Link to="/news" className="hover:bg-blue-700 px-3 py-2 rounded">News</Link>
              <Link to="/saved" className="hover:bg-blue-700 px-3 py-2 rounded">Saved</Link>
              <button onClick={handleLogout} className="hover:bg-blue-700 px-3 py-2 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded">Login</Link>
              <Link to="/register" className="hover:bg-blue-700 px-3 py-2 rounded">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
