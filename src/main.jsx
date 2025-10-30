import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css';
import App from './App.jsx'
import HomePage from './pages/HomePage.tsx'
import CareerPage from './pages/CareerPage.tsx'
import AdminLogin from './pages/LoginPage.tsx'
import AdminDashboard from './pages/AdminDashboard.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/career",
        element: <CareerPage />,
      },
      {
        path: "/login",
        element: <AdminLogin />,
      },
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)