import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Purchases', path: '/purchases' },
  { name: 'Transfers', path: '/transfers' },
  { name: 'Assignments & Expenditures', path: '/assignments' },
];

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();            // clear token and user
    navigate('/');       // redirect to login
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-blue-700 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Military System</h2>
        <nav className="space-y-4">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded hover:bg-blue-600 ${
                pathname === item.path ? 'bg-blue-600' : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="mt-6 text-red-300 hover:text-red-500"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default Layout;
