import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/verify-otp/`, { email, otp });
      if (response.status === 200) {
        navigate('/login'); // ไปหน้า login หลังยืนยันสำเร็จ
      }
    } catch (err) {
      setError(err.response?.data.message || 'Verification failed');
    }
  };

  return (
    <div className="verify-otp-container min-h-screen flex items-center justify-center">
      <div className="relative mx-auto p-6 bg-white/25 backdrop-blur-sm rounded-3xl shadow-md w-full max-w-sm">
        <h2 className="text-center text-3xl text-white font-bold mb-6">Verify OTP</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={email} readOnly className="w-full p-4 border rounded-md bg-gray-200" />
          <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="w-full p-4 border rounded-md" required />
          <button type="submit" className="w-full py-2 bg-white text-black rounded-md">Verify</button>
        </form>
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default VerifyOTP;