import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { usePostStore } from '../context/postStore';
import { useTaskStore } from '../context/taskStore';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { posts, fetchPosts } = usePostStore();
  const { tasks, fetchTasks } = useTaskStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchTasks();
  }, [fetchPosts, fetchTasks]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Welcome, {user?.name}!</h1>
        <p className="text-gray-600 dark:text-gray-300">
          This is your dashboard. Here you can manage your posts, profile, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Your Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Total Posts:</span>
              <span className="font-medium text-gray-800 dark:text-white">{posts.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Work Posts:</span>
              <span className="font-medium text-gray-800 dark:text-white">{posts.filter(p => p.category === 'work').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Personal Posts:</span>
              <span className="font-medium text-gray-800 dark:text-white">{posts.filter(p => p.category === 'personal').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Assigned Tasks</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Total Tasks:</span>
              <span className="font-medium text-gray-800 dark:text-white">{tasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Completed:</span>
              <span className="font-medium text-green-600 dark:text-green-400">{tasks.filter(t => t.status === 'completed').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">In Progress:</span>
              <span className="font-medium text-blue-600 dark:text-blue-400">{tasks.filter(t => t.status === 'in-progress').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-300">Pending:</span>
              <span className="font-medium text-yellow-600 dark:text-yellow-400">{tasks.filter(t => t.status === 'pending').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 md:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Posts</h2>
          {posts.length > 0 ? (
            <div className="space-y-3">
              {posts.slice(0, 3).map((post) => (
                <div key={post._id} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white">{post.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{post.content}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      post.category === 'work' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                      post.category === 'personal' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                    }`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No posts yet. Create your first post!</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => navigate('/tasks')} className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md transition duration-300">
            View My Tasks
          </button>
          <button onClick={() => navigate('/posts')} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300">
            Create Post
          </button>
          <button onClick={() => navigate('/profile')} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-300">
            View Profile
          </button>
          <button onClick={() => navigate('/posts')} className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition duration-300">
            Manage Posts
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;