import { RouterProvider } from 'react-router-dom';
import { useState } from 'react';
import { createAppRouter } from './router';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = createAppRouter(isAuthenticated, setIsAuthenticated);

  return <RouterProvider router={router} />;
}
