import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './Home.jsx'
import Register from './Register.jsx'
import Login from './Login.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx';
import Login_admin from './Login_admin.jsx';
// import ProtectedRoute from './components/ProtectedRoute.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: 
      
        
        <App />
        

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

]);


// <ProtectedRoute></ProtectedRoute> 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* Wrap App ด้วย AuthProvider */}
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
