import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const RegisterStep1 = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    nick_name: '',
    email: '',
    phone_number: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/register/step1/`, formData);
      if (response.status === 200) {
        navigate('/verify-otp', { state: { email: formData.email } });
      }
    } catch (err) {
      setError(err.response?.data.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container min-h-screen flex items-center justify-center">
      <div className="relative mx-auto p-6 bg-white/25 backdrop-blur-sm rounded-3xl shadow-md w-full max-w-sm">
        <h2 className="text-center text-3xl text-white font-bold mb-6">Register - Step 1</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" className="w-full p-4 border rounded-md" required />
          <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" className="w-full p-4 border rounded-md" required />
          <input name="nick_name" value={formData.nick_name} onChange={handleChange} placeholder="Nick Name (Optional)" className="w-full p-4 border rounded-md" />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-4 border rounded-md" required />
          <input name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="Phone Number (Optional)" className="w-full p-4 border rounded-md" />
          <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" className="w-full p-4 border rounded-md" required />
          <button type="submit" className="w-full py-2 bg-white text-black rounded-md">Send OTP</button>
        </form>
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default RegisterStep1;