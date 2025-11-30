import HomePage from './pages/HomePage';
import PredictPage from './pages/PredictPage';
import ResultsPage from './pages/ResultsPage';
import AdminPage from './pages/AdminPage';
import type { ReactNode } from 'react';
import LoginPage from './pages/LoginPage';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <HomePage />,
    visible: true
  },
  {
    name: 'Predict',
    path: '/predict',
    element: <PredictPage />,
    visible: true
  },
  {
    name: 'Results',
    path: '/results/:id',
    element: <ResultsPage />,
    visible: false
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <AdminPage />,
    visible: true
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />,
    visible: true
  }
];

export default routes;