import { RouterProvider } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { createAppRouter } from './router';
import { apiService } from './Service/api';
import { SettingsProvider } from './context/SettingsContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!apiService.getToken());
  const router = createAppRouter(isAuthenticated, setIsAuthenticated);

  // Silent analytics tracking for global "Profile Views"
  useEffect(() => {
    apiService.post('/api/stats/view', {}).catch(() => {});
  }, []);

  return (
    <SettingsProvider>
      <RouterProvider router={router} />
    </SettingsProvider>
  );
}
