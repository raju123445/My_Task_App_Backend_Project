import { create } from 'zustand';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const useThemeStore = create((set) => ({
  theme: getInitialTheme(),
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      // set on both html and body to cover different CSS approaches
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      document.body.classList.toggle('dark', newTheme === 'dark');
    }
    return { theme: newTheme };
  }),

  setTheme: (theme) => set(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.body.classList.toggle('dark', theme === 'dark');
    }
    return { theme };
  }),

  initTheme: () => {
    const initialTheme = getInitialTheme();
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', initialTheme);
      document.documentElement.classList.toggle('dark', initialTheme === 'dark');
      document.body.classList.toggle('dark', initialTheme === 'dark');
    }
    // Ensure the store's state is updated as well
    set({ theme: initialTheme });
    return initialTheme;
  }
}));

export { useThemeStore };
