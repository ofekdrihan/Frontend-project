import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Create a root element to render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the app inside the root element
root.render(
  <React.StrictMode>  {/* StrictMode helps with development by highlighting potential problems */}
    <App />  {/* Render the App component */}
  </React.StrictMode>
);