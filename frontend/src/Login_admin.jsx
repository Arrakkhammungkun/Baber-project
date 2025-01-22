import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import axios from 'axios';
const apiUrl =import.meta.env.VITE_API_URL;
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login_Admin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/login/admin`, {
        email,
        password,
      });

  
      if (response.status === 200) {
        const { data } = response.data; 
        const admin = { first_name: data.first_name, email: data.email }; 
        const token = data.token;

        login_Admin(admin, token);
      

        console.log('Login successful:', data);  
          
        
        // window.location.href = '/home'; 
        
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message); 
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container min-h-screen flex items-center justify-center">
  <div className="mx-auto p-6 bg-white rounded-lg shadow-md w-full max-w-sm">
    <h2 className="text-center text-2xl font-bold mb-4">Login admin</h2>
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Enter your password"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Login
      </button>

      {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
    </form>
  </div>
</div>

  );
};

export default Login;
