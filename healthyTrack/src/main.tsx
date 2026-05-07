import '@/i18n';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';

// Initialize theme as early as possible to prevent flash of wrong theme
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('vitatrack-theme');
  if (savedTheme) {
    try {
      const parsedTheme = JSON.parse(savedTheme);
      if (parsedTheme.state?.isDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch (e) {
      console.error('Failed to parse theme:', e);
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.style.colorScheme = 'light';
    }
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.style.colorScheme = 'light';
  }
};

initializeTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);