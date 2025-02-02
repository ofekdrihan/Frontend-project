// Import React and ReactDOM to render the app
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import the main CSS file for the app
import './index.css';

// Import the root App component of the app
import App from './App';

// Import the reportWebVitals function for performance monitoring
import reportWebVitals from './reportWebVitals';

// Create a root element to render the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside the root element
root.render(
  <React.StrictMode>  {/* StrictMode helps with development by highlighting potential problems */}
    <App />  {/* Render the App component */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();  // Start measuring web vitals (performance data)
