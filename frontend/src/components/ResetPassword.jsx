import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirm_password: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      setMessage('Password must be at least 8 characters long');
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post(`${apiUrl}/reset-password/`, {  // ใช้ /reset-password/
        email,
        password: formData.password,  // ส่งเฉพาะ email และ password
      });
      if (response.status === 200) {
        navigate('/reset-success');
      }
    } catch (err) {
      if (err.response) {
        console.log('Error response:', err.response.data);  // เพิ่ม log เพื่อ debug
        setMessage(err.response.data.message || 'Error: Unable to update password');
      } else {
        setMessage('Error: Unable to update password');
      }
    }
  };

  return (
    <div className="login-container min-h-screen flex items-center justify-center bg-[url(/src/img/login.png)] bg-cover bg-center h-screen w-full">
      <div className="absolute inset-0 bg-black/70 brightness-50">
        <div className="flex flex-col h-screen w-full text-white relative justify-center">
          <div className="grid grid-cols-2 tracking-[-0.75rem] mx-10 mt-auto">
            <h1 className="text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[11rem] 2xl:text-[12rem] font-extrabold inline-block mb-4 text-start">
              WELCOME
            </h1>
            <h1 className="text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[11rem] 2xl:text-[12rem] font-extrabold inline-block mb-4 text-end">
              TO
            </h1>
          </div>
          <div className="grid grid-cols-2 tracking-[-0.75rem] mx-10">
            <h1 className="w-full text-center text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[11rem] 2xl:text-[12rem] font-extrabold inline-block mb-4">
              THE
            </h1>
            <h1 className="w-full text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] 2xl:text-[12rem] font-extrabold inline-block mb-4">
              STYLEX
            </h1>
          </div>
          <div className="mt-auto">
            <h1 className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-8">
              STYLEX
            </h1>
            <h1 className="text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-extrabold">
              LET STYLEX TAKE CARE OF YOU
            </h1>
          </div>
        </div>
      </div>

      <div className="relative mx-auto p-6 bg-white/25 backdrop-blur-sm rounded-3xl shadow-md w-full max-w-sm h-auto flex flex-col">
        <h2 className="text-3xl text-white font-bold mb-2">Set a New Password</h2>
        <p className="text-sm text-white font-normal mb-6">
          Create a new password. Ensure it differs from previous ones for security
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col flex-grow justify-between">
          <div className="mb-4">
            <label className="text-white">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-md shadow-md shadow-gray-800 mt-2"
              placeholder="Enter your new password"
              required
            />
          </div>
          <div className="mb-4">
            <label className="text-white">Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full p-4 border border-gray-300 rounded-md shadow-md shadow-gray-800 mt-2"
              placeholder="Re-enter password"
              required
            />
          </div>
          <div className="mt-auto flex justify-center">
            <button
              type="submit"
              className="w-full py-2 px-12 bg-[#4595ED] text-white font-bold rounded-3xl hover:bg-[#2F80ED] hover:text-white ease-in-out duration-300"
            >
              Update Password
            </button>
          </div>
          {message && <div className="mt-4 text-red-500 text-center">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;