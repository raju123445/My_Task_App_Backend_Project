import { Link } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { useUiStore } from '../context/uiStore';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUiStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="md:hidden mr-3 p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2zm0 4h14a1 1 0 110 2H3a1 1 0 110-2z" clipRule="evenodd" />
          </svg>
        </button>
        <Link to="/dashboard" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          MyPostApp
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        {user && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {/* {user.name} */}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;