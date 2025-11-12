import axios from 'axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';
import { apiUrl } from '../utils/constants';

const useTaskStore = create((set) => ({
  tasks: [],
  stats: null,
  loading: false,
  error: null,

  // Get all tasks
  fetchTasks: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${apiUrl}/tasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      set({ tasks: response.data.data, loading: false });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch tasks';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  // Get task by ID
  fetchTaskById: async (id) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${apiUrl}/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch task';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },

  // Create new task
  createTask: async (taskData) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post(`${apiUrl}/tasks`, taskData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      set((state) => ({
        tasks: [response.data.data, ...state.tasks],
        loading: false
      }));
      toast.success('Task created successfully!');
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create task';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Update task
  updateTask: async (id, taskData) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.put(`${apiUrl}/tasks/${id}`, taskData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      set((state) => ({
        tasks: state.tasks.map((task) => (task._id === id ? response.data.data : task)),
        loading: false
      }));
      toast.success('Task updated successfully!');
      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update task';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${apiUrl}/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      set((state) => ({
        tasks: state.tasks.filter((task) => task._id !== id),
        loading: false
      }));
      toast.success('Task deleted successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete task';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Add comment to task
  addComment: async (taskId, comment) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post(`${apiUrl}/tasks/${taskId}/comment`, { comment }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      set((state) => ({
        tasks: state.tasks.map((task) => (task._id === taskId ? response.data.data : task)),
        loading: false
      }));
      toast.success('Comment added successfully!');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add comment';
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Get task statistics
  fetchStats: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(`${apiUrl}/tasks/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      set({ stats: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch statistics';
      set({ error: errorMessage, loading: false });
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export { useTaskStore };

