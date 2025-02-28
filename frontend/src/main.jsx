import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {
  createBrowserRouter,
  RouterProvider,
  useMatch,
} from "react-router-dom";
import Home from './Home.jsx';
import Register from './Register.jsx';
import Login from './Login.jsx';
import Forgot_password from './Forgot_password.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Login_admin from './Login_admin.jsx';
import AddServiceForm from './components/AddServiceForm.jsx';
import Add_Service from './Add_Service.jsx';
import EditServiceForm from './components/EditServiceForm.jsx';
import Bookingbarber from './Bookingbarber.jsx'; //
import Manage_Employee from './Manage_Employee.jsx';
import BookingForm from './components/BookingForm.jsx';
import Booking_Management from './Booking_Management.jsx';
import Booking from './Test.jsx';
import AdminQueueStatus from './AdminQueueStatus.jsx';
import Test_service from './Test_servie.jsx';
import Managment from './Managment.jsx';
import Dashboard from './Dashboard.jsx';
import Queue from './Queue.jsx';
import CircularGallery from './CircularGallery.jsx';
import Profile from './Profile.jsx';

import ProfilePage from './Profile.jsx';
import RegisterStep1 from './RegisterStep1.jsx';
import VerifyOTP from './components/VerifyOTP.jsx';
// import ProtectedRoute from './components/ProtectedRoute.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/home',
    element: <App />,
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
    path: 'bookings',
    element: <BookingForm  />,
  },
  {
    path: 'admin/manage/bookings',
    element: <Booking_Management  />,
  },
  {
    path: 'test',
    element: <Booking  />,
  },
  {
    path: 'test_adminQ',
    element: <AdminQueueStatus  />,
  },
  {
    path: 'test_service',
    element: <Test_service  />,
  },
  {
    
    path: '/test_service/:serviceId/bookingbarber', 
    element: <Bookingbarber />,
  },
  {
    
    path: '/admin/manage', 
    element: <Managment />,
  },
  {
    
    path: '/admin/dashboard', 
    element: <Dashboard />,
  },
  {
    
    path: '/queue', 
    element: <Queue />,
  },
  {
    
    path: '/gallery', 
    element: <CircularGallery />,
  },
  {
    
    path: '/forgot_password', 
    element: <Forgot_password />,
  },
  {
    
    path: '/profile', 
    element: <Profile />,
  },
  {
    
    path: '/register/step1', 
    element: <RegisterStep1 />,
  },
  {
    
    path: '/verify-otp', 
    element: <VerifyOTP />,
  },

  

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
