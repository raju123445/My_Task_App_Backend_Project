import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Welcome to Scalable MERN Dashboard</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">A secure and scalable dashboard application</p>
      <div className="flex space-x-4">
        <Link
          to="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-300"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;