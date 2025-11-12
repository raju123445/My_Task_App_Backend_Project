import { useEffect } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import ToastMessage from './components/ToastMessage';
import { useAuthStore } from './context/authStore';
import { useThemeStore } from './context/themeStore';

// Import pages
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Posts from './pages/Posts';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Users from './pages/Users';
import UserTasks from './pages/UserTasks';

function App() {
  const { loadUser } = useAuthStore();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme
    initTheme();
    
    // Load user if token exists
    loadUser();
  }, [loadUser, initTheme]);

  return (
    <Router>
  <div className="flex min-h-screen w-full bg-gray-100 dark:bg-gray-900">
        <ToastMessage />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div className="flex flex-1">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto">
                    <Navbar />
                    <div className="p-6">
                      <Dashboard />
                    </div>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <div className="flex flex-1">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto">
                    <Navbar />
                    <div className="p-6">
                      <Profile />
                    </div>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <div className="flex flex-1">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto">
                    <Navbar />
                    <div className="p-6">
                      <Posts />
                    </div>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute adminOnly={true}>
                <div className="flex flex-1">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto">
                    <Navbar />
                    <div className="p-6">
                      <Users />
                    </div>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute adminOnly={true}>
                <div className="flex flex-1">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto">
                    <Navbar />
                    <div className="p-6">
                      <AdminDashboard />
                    </div>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <div className="flex flex-1">
                  <Sidebar />
                  <main className="flex-1 overflow-y-auto">
                    <Navbar />
                    <div className="p-6">
                      <UserTasks />
                    </div>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
