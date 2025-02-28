import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const VerifyOTPForget = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/verify-otp-forgot/`, {
        email,
        otp, // เช่น "843629"
      });
      if (response.status === 200) {
        navigate('/reset-password', { state: { email } });
      }
    } catch (err) {
      if (err.response) {
        console.log(err.response.data); // ดูรายละเอียด error
        setError(err.response.data.message || 'Invalid OTP');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container min-h-screen flex items-center justify-center bg-[url(/src/img/login.png)] bg-cover bg-center h-screen w-full">
      <div className="absolute inset-0 bg-black/70 brightness-50">
        <div className="flex flex-col h-screen w-full text-white relative justify-center">
          {/* ... (UI เดิม) */}
        </div>
      </div>

      <div className="relative mx-auto p-6 bg-white/25 backdrop-blur-sm rounded-3xl shadow-md w-full max-w-sm h-auto flex flex-col">
        <h2 className="text-3xl text-white font-bold mb-2">Verify OTP</h2>
        <p className="text-sm text-white font-normal mb-6">Please enter the OTP sent to your email</p>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col flex-grow justify-between">
          <div className="mb-4">
            <label className="text-white">Your Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full p-4 border border-gray-300 rounded-md shadow-md shadow-gray-800 mt-2 bg-gray-200"
            />
          </div>
          <div className="mb-4">
            <label className="text-white">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md shadow-md shadow-gray-800 mt-2"
              placeholder="Enter OTP"
              required
            />
          </div>
          <div className="mt-auto flex justify-center">
            <button
              type="submit"
              className="w-full py-2 px-12 bg-[#4595ED] text-white font-bold rounded-3xl hover:bg-[#2F80ED] hover:text-white ease-in-out duration-300"
            >
              Verify OTP
            </button>
          </div>
          {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default VerifyOTPForget;