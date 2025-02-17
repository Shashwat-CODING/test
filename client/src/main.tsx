import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register service worker
const registerSW = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      // Optional: Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, you can notify the user if you want
              console.log('New content is available; please refresh.');
            }
          });
        }
      });
      
      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Initialize the app and register service worker
const init = async () => {
  // Register service worker
  await registerSW();
  
  // Render the app
  const root = createRoot(document.getElementById("root")!);
  root.render(<App />);
};

// Start the application
init();