import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './Home.jsx';
import Register from './Register.jsx';
import Login from './Login.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Login_admin from './Login_admin.jsx';
import AddServiceForm from './components/AddServiceForm.jsx';
import Add_Service from './Add_Service.jsx';
import EditServiceForm from './components/EditServiceForm.jsx';
import Bookingbarber from './Bookingbarber.jsx'; //
import Manage_Employee from './Manage_Employee.jsx';
import Managment from './Managment.jsx';
// import ProtectedRoute from './components/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/login/admin',
    element: <Login_admin />,
  },
  {
    path: '/add/services',
    element: <AddServiceForm />,
  },
  {
    path: '/admin/addservices',
    element: <Add_Service />,
  },
  {
    path: '/admin/editservice',
    element: <EditServiceForm />,
  },
  {
    path: '/bookingbarber',
    element: <Bookingbarber />,
  },
  {
    path: 'admin/manage/employees',
    element: <Manage_Employee />,
  },
  {
    path: 'admin/manage/managment',
    element: <Managment />,
  },
  

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
