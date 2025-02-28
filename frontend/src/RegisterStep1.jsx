import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const RegisterStep1 = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    nick_name: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiUrl}/register/step1/`, formData);
      if (response.status === 200) {
        navigate("/verify-otp", { state: { email: formData.email } });
      }
    } catch (err) {
      setError(err.response?.data.message || "Registration failed");
    }
  };

  return (
    <div className="register-container min-h-screen flex items-center justify-center bg-[url(/src/img/login.png)] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/70 brightness-50">
        <div className="flex flex-col h-screen w-full text-white relative justify-center">
          <div className="grid grid-cols-2 tracking-[-0.75rem] mx-10 mt-auto">
            <h1
              className={`text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[11rem] 2xl:text-[12rem] font-extrabold inline-block mb-4 text-start`}
            >
              WELCOME
            </h1>
            <h1
              className={`text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[11rem] 2xl:text-[12rem] font-extrabold inline-block mb-4 text-end`}
            >
              TO
            </h1>
          </div>
          <div className="grid grid-cols-2 tracking-[-0.75rem] mx-10">
            <h1
              className={`w-full text-center text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[11rem] 2xl:text-[12rem] font-extrabold inline-block mb-4`}
            >
              THE
            </h1>
            <h1
              className={`w-full text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] 2xl:text-[12rem] font-extrabold inline-block mb-4`}
            >
              STYLEX
            </h1>
          </div>
          <div className="mt-auto">
            <h1
              className={`text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold mb-8`}
            >
              STYLEX
            </h1>
            <h1
              className={`text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-extrabold `}
            >
              LET STYLEX TAKE CARE OF YOU
            </h1>
          </div>
        </div>
      </div>
      <div className="relative mx-auto py-6  px-10 bg-white/25 backdrop-blur-sm rounded-3xl shadow-md w-full max-w-md">
        <h2 className="text-center text-3xl text-white font-bold mb-6">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="flex-col">
          <div className="mb-1">
            <label className="text-white">First Name</label>
            <input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full p-1 border rounded-md"
              required
            />
          </div>
          <div className="mb-1">
            <label className="text-white">Last Name</label>
            <input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full p-1 border rounded-md"
              required
            />
          </div>
          <div className="mb-1">
            <label className="text-white">Nickname</label>
            <input
              name="nick_name"
              value={formData.nick_name}
              onChange={handleChange}
              placeholder="Nick Name (Optional)"
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-1">
            <label className="text-white">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-1 border rounded-md"
              required
            />
          </div>
          <div className="mb-1">
            <label className="text-white">Phone Number</label>
            <input
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Phone Number (Optional)"
              className="w-full p-1 border rounded-md"
            />
          </div>
          <div className="mb-1">
            <label className="text-white">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-1 border rounded-md"
              required
            />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full py-2 bg-white text-black rounded-md hover:bg-black hover:text-white duration-500 ease-in-out"
            >
              Send OTP
            </button>
          </div>
        </form>
        {error && <div className="mt-4 text-red-500 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default RegisterStep1;
