/* eslint-disable no-irregular-whitespace */
import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
const apiUrl =import.meta.env.VITE_API_URL;
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/login/admin`, {
        email,
        password,
      });

  
      if (response.status === 200) {
        const { data } = response.data; 
        const user = { first_name: data.first_name,
          last_name: data.first_name, 
          email: data.email,
          profile_image:data.profile_image ,
          nick_name: data.first_name,
          phone_number:data.phone_number
          

        
        }; 
        const token = data.token;

        login(user, token);
      

        console.log('Login successful:', data);  
          
        
        window.location.href = '/'; 
        
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
    <div className="login-container min-h-screen flex items-center justify-center bg-[url(/src/img/login.png)] bg-cover bg-center h-screen w-full">
      <div className='absolute inset-0 bg-black/70 brightness-50'>
      <div className="flex flex-col h-screen w-full text-white relative justify-center">
              <div className="grid grid-cols-2 tracking-[-0.75rem] mx-10 mt-auto">
                <h1 className={`text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[11rem] 2xl:text-[12rem] font-extrabold inline-block mb-4 text-start`}>
                  WELCOME
                </h1>
                <h1 className={`text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[11rem] 2xl:text-[12rem] font-extrabold inline-block mb-4 text-end`}>
                  TO
                </h1>
              </div>
              <div className="grid grid-cols-2 tracking-[-0.75rem] mx-10">
                <h1 className={`w-full text-center text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[11rem] 2xl:text-[12rem] font-extrabold inline-block mb-4`}>
                THE
                </h1>
                <h1 className={`w-full text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] 2xl:text-[12rem] font-extrabold inline-block mb-4`}>
                  STYLEX
                </h1>
              </div>
              <div className='mt-auto'>
                <h1 className={`text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-8`}>
                STYLEX
                </h1>
                <h1 className={`text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-extrabold `}>
                LET STYLEX TAKE CARE OF YOU
                </h1>
              </div>
        </div>
      </div>
      
      <div className="relative mx-auto p-6  bg-white/25 backdrop-blur-sm rounded-3xl shadow-md w-full max-w-sm ">
        <h2 className="text-center text-3xl text-white font-bold mb-6">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="mb-4 shadow-md shadow-gray-800 rounded-md">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4 shadow-md shadow-gray-800 rounded-md">
            
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-md"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className='flex justify-end'>
            <a className='text-[#4595ED] hover:underline' href='#'>forget password?</a>
          </div>
          <div className='flex justify-end'>
            <button
              type="submit"
              className=" w-auto text-sm py-1 px-5 bg-white text-black font-bold  rounded-md hover:bg-black hover:text-white "
            > 
              Login
            </button>
          </div>
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-grow border-t-2 border-dashed border-gray-300"></div>
              <span className="text-white">Or</span>
            <div className="flex-grow border-t-2 border-dashed border-gray-300"></div>
          </div>
          <div className='flex'>
            <button
              type="submit"
              className=" w-full py-2 px-12 bg-white text-black font-bold  rounded-3xl hover:bg-black hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512" className="w-6 h-6 inline-block mr-2 fill-current"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg> 
              Continue with Google
            </button>
          </div>

          <div className='flex justify-start'>
            <a className='text-white mr-1'>New User?</a>
            <Link to="/register">
            <a className='text-[#4595ED] hover:underline' href='#'>Create an account</a>
            </Link>
          </div>
          


          {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
        </form>
      </div>
    </div>

  );
};

export default Login;
