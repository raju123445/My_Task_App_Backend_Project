import { create } from 'zustand';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';

const useUserStore = create((set) => ({
  users: [],
  loading: false,
  error: null,
  
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const data = await userService.getUsers();
      set({ users: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message || 'Error fetching users');
    }
  },
  
  updateUser: async (id, userData) => {
    set({ loading: true, error: null });
    try {
      const updatedUser = await userService.updateUser(id, userData);
      set((state) => ({
        users: state.users.map(user => user._id === id ? updatedUser : user),
        loading: false
      }));
      toast.success('User updated successfully!');
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message || 'Error updating user');
    }
  },
  
  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await userService.deleteUser(id);
      set((state) => ({
        users: state.users.filter(user => user._id !== id),
        loading: false
      }));
      toast.success('User deleted successfully!');
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message || 'Error deleting user');
    }
  }
}));

export { useUserStore };