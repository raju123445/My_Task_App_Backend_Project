import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastMessage = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
        },
      }}
    />
  );
};

export default ToastMessage;