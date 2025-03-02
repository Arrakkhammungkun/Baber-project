import { useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/login/`, {
        email,
        password,
      });

      if (response.status === 200) {
        const { data } = response.data;
        const user = {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          profile_image: data.profile_image,
          nick_name: data.nick_name,
          phone_number: data.phone_number,
          user_id: data.user_id,
        };

        const token = data.token;

        login(user, token);

        

        window.location.href = '/';
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-container min-h-screen flex items-center justify-center bg-[url(/src/img/login.png)] bg-cover bg-center h-screen w-full">
      <div className="absolute inset-0 bg-black/70 brightness-50">
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
          <div className="mt-auto">
            <h1 className={`text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-8`}>
              STYLEX
            </h1>
            <h1 className={`text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-extrabold `}>
              LET STYLEX TAKE CARE OF YOU
            </h1>
          </div>
        </div>
      </div>

      <div className="relative mx-auto p-6 bg-white/25 backdrop-blur-sm rounded-3xl shadow-md w-full max-w-sm">
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
          
          <div className="flex justify-end">
            <Link to="/forgot_password" className="text-[#4595ED] hover:underline">
              forget password?
            </Link>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="w-auto text-sm py-1 px-5 bg-white text-black font-bold rounded-md hover:bg-black hover:text-white"
            >
              Login
            </button>
          </div>



          <div className="flex">

          </div>

          <div className="flex justify-start">
            <span className="text-white mr-1">New User?</span> {/* เปลี่ยน <a> เป็น <span> */}
            <Link to="/register/step1" className="text-[#4595ED] hover:underline">
              Create an account
            </Link>
          </div>

          {error && (
            <div className="mt-4 text-red-500 text-center">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;