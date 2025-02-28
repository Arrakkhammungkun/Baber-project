import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/forgot-password/`, { email });
      if (response.status === 200) {
        navigate('/verify-otp2', { state: { email } }); // ไปหน้า Verify OTP
        setMessage('');
      }
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message || 'Error: Unable to reset password');
      } else {
        setMessage('Error: Unable to reset password');
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

      <div className="relative mx-auto p-6 bg-white/25 backdrop-blur-sm rounded-3xl shadow-md w-full max-w-sm h-2/5 flex flex-col">
        <h2 className="text-3xl text-white font-bold mb-2">Forgot Password</h2>
        <p className="text-sm text-white font-normal mb-6">Please enter your email to reset the password</p>
        <form onSubmit={handleResetPassword} className="space-y-4 flex flex-col flex-grow justify-between">
          <div className="mb-4">
            <label className="text-white">Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md shadow-md shadow-gray-800 mt-2"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mt-auto flex justify-center">
            <button
              type="submit"
              className="w-full py-2 px-12 bg-[#4595ED] text-white font-bold rounded-3xl hover:bg-[#2F80ED] hover:text-white ease-in-out duration-300"
            >
              Reset Password
            </button>
          </div>
          {message && <div className="mt-4 text-red-500 text-center">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;