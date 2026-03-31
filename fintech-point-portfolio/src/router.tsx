import { createBrowserRouter, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/dashboard/Login';

export const createAppRouter = (isAuthenticated: boolean, setIsAuthenticated: (val: boolean) => void) => createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={() => setIsAuthenticated(true)} />,
  },
  {
    path: "/dashboard",
    element: isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  }
]);
