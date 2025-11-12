import React, { useState, useEffect } from 'react';
import { usePostStore } from '../context/postStore'; // We'll create this store later
import Loader from '../components/Loader';

const Posts = () => {
  const { posts, loading, createPost, updatePost, deletePost, fetchPosts } = usePostStore();
  const [showForm, setShowForm] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'other'
  });

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (currentPost) {
      // Update existing post
      await updatePost(currentPost._id, formData);
    } else {
      // Create new post
      await createPost(formData);
    }
    
    // Reset form and close form
    setFormData({ title: '', content: '', category: 'other' });
    setShowForm(false);
    setCurrentPost(null);
  };

  const handleEdit = (post) => {
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category
    });
    setCurrentPost(post);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(id);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setCurrentPost(null);
    setFormData({ title: '', content: '', category: 'other' });
  };

  if (loading && posts.length === 0) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Posts</h1>
        <button
          onClick={() => {
            setCurrentPost(null);
            setFormData({ title: '', content: '', category: 'other' });
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
        >
          Create Post
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            {currentPost ? 'Edit Post' : 'Create New Post'}
          </h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="title">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="content">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleFormChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
              >
                {currentPost ? 'Update Post' : 'Create Post'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post._id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{post.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                post.category === 'work' ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' :
                post.category === 'personal' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
              }`}>
                {post.category}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{post.content}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(post)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No posts found. Create your first post!</p>
        </div>
      )}
    </div>
  );
};

export default Posts;