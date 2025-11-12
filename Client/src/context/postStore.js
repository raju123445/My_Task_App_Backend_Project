import { create } from 'zustand';
import { postService } from '../services/postService';
import toast from 'react-hot-toast';

const usePostStore = create((set) => ({
  posts: [],
  loading: false,
  error: null,
  
  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const data = await postService.getPosts();
      set({ posts: data.posts, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message || 'Error fetching posts');
    }
  },
  
  createPost: async (postData) => {
    set({ loading: true, error: null });
    try {
      const newPost = await postService.createPost(postData);
      set((state) => ({ posts: [newPost, ...state.posts], loading: false }));
      toast.success('Post created successfully!');
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message || 'Error creating post');
    }
  },
  
  updatePost: async (id, postData) => {
    set({ loading: true, error: null });
    try {
      const updatedPost = await postService.updatePost(id, postData);
      set((state) => ({
        posts: state.posts.map(post => post._id === id ? updatedPost : post),
        loading: false
      }));
      toast.success('Post updated successfully!');
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message || 'Error updating post');
    }
  },
  
  deletePost: async (id) => {
    set({ loading: true, error: null });
    try {
      await postService.deletePost(id);
      set((state) => ({
        posts: state.posts.filter(post => post._id !== id),
        loading: false
      }));
      toast.success('Post deleted successfully!');
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error(error.message || 'Error deleting post');
    }
  }
}));

export { usePostStore };