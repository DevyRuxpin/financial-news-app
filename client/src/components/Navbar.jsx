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
    <nav className="bg-blue-600 text-white shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold hover:text-blue-200">Financial News</Link>
          
          <div className="flex space-x-6">
            <Link to="/news" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">News</Link>
            {user ? (
              <>
                <Link to="/saved" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">Saved</Link>
                <button onClick={handleLogout} className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">Login</Link>
                <Link to="/register" className="hover:bg-blue-700 px-3 py-2 rounded transition-colors">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
