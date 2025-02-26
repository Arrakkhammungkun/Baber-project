
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const Forgot_password = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_password: ''
  });
  const [message, setMessage] = useState('');
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);

  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/reset-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });
      
      if (response.ok) {
        setIsResetSuccess(true);
        setMessage('');
      } else {
        const data = await response.json();
        setMessage(data.detail || 'Error: Unable to reset password');
      }
    } catch (err) {
      setMessage('Error: Unable to reset password');
    }
  };

  const handleConfirm = async (e) => {
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
      const response = await fetch(`${apiUrl}/update-password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsUpdateSuccess(true);
        setMessage('');
      } else {
        setMessage(data.detail || 'Error: Unable to update password');
      }
    } catch (err) {
      setMessage('Error: Unable to update password');
    }
  };

  const handleSuccessConfirm = (e) => {
    e.preventDefault();
    // ไม่ทำอะไรเพิ่มเติม คงอยู่หน้า Successful
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

      {!isResetSuccess ? (
        <div className="relative mx-auto p-6 bg-white/25 backdrop-blur-sm rounded-3xl shadow-md w-full max-w-sm h-2/5 flex flex-col">
          <h2 className="text-3xl text-white font-bold mb-2">Forgot password</h2>
          <p className="text-sm text-white font-normal mb-6">Please enter your email to reset the password</p>
          <form onSubmit={handleResetPassword} className="space-y-4 flex flex-col flex-grow justify-between">
            <div className="mb-4">
              <label className="text-white">Your Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
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
                Reset password
              </button>
            </div>
            {message && <div className="mt-4 text-red-500 text-center">{message}</div>}
          </form>
        </div>
      ) : !isUpdateSuccess ? (
        <div className="relative mx-auto p-6 bg-white/25 backdrop-blur-sm rounded-3xl shadow-md w-full max-w-sm h-auto flex flex-col">
          <h2 className="text-3xl text-white font-bold mb-2">Set a new password</h2>
          <p className="text-sm text-white font-normal mb-6">
            Create a new password. Ensure it differs from previous ones for security
          </p>
          <form onSubmit={handleConfirm} className="space-y-4 flex flex-col flex-grow justify-between">
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
      ) : (
        <div className="relative mx-auto p-6 bg-white/25 backdrop-blur-sm rounded-3xl shadow-md w-full max-w-sm h-auto flex flex-col">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="checkmark animate-checkmark">
              <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-white text-2xl font-bold mt-4">Successful</p>
            <p className="text-sm text-white font-normal text-center mb-6">
              Congratulations! Your password has been changed. Click continue to login
            </p>
            <form onSubmit={handleSuccessConfirm} className="mt-6 w-full">
              <Link to="/login">
                <button
                  type="submit"
                  className="w-full py-2 px-12 bg-[#4595ED] text-white font-bold rounded-3xl hover:bg-[#2F80ED] hover:text-white ease-in-out duration-300"
                >
                  Continue
                </button>
              </Link>
            </form>
          </div>
        </div>
      )}

      <style >{`
        .checkmark {
          display: inline-block;
        }
        .animate-checkmark {
          animation: draw 0.5s ease forwards;
        }
        @keyframes draw {
          0% {
            stroke-dasharray: 0, 100;
          }
          100% {
            stroke-dasharray: 100, 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Forgot_password;