import { createBrowserRouter } from 'react-router-dom';
import authRoutes from './authRoutes';
import mainRoutes from './mainRoutes';

export const router = createBrowserRouter([
  mainRoutes,
  authRoutes,
]);
