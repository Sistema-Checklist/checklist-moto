import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
<<<<<<< HEAD

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
=======
import { AuthProvider } from '@/contexts/SupabaseAuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
>>>>>>> e6341e13c18ec2e9698b8bfd0bf48aa94c6d8743
  </React.StrictMode>
);