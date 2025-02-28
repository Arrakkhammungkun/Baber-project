import { useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL;

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    // ตรวจสอบว่าเป็นตัวเลขหรือไม่ และจำกัด 1 ตัวอักษร
    if (!/^\d*$/.test(value) || value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    // ตรวจสอบว่าเป็นตัวเลขทั้งหมดหรือไม่
    if (!/^\d{0,6}$/.test(pastedData)) return;
    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);
    inputRefs.current[5].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    try {
      const response = await axios.post(`${apiUrl}/verify-otp/`, {
        email,
        otp: otpString,
      });
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data.message || "Verification failed");
    }
  };

  return (
    <div className="register-container min-h-screen flex flex-col lg:flex-row items-center justify-center bg-[url(/src/img/login.png)] bg-cover bg-center">
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
              className={`text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-extrabold`}
            >
              LET STYLEX TAKE CARE OF YOU
            </h1>
          </div>
        </div>
      </div>
      <div className="relative mx-auto p-4 sm:p-6 bg-white/25 backdrop-blur-sm rounded-3xl shadow-md w-full max-w-[90%] sm:max-w-sm">
        <h2 className="text-center text-xl sm:text-3xl text-white font-bold mb-4 sm:mb-6">
          Verify OTP
        </h2>
        <p className="text-sm sm:text-md text-white mb-4 sm:mb-6">
          We sent a reset link to {email} enter 6 digit code that mentioned in
          the email
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* <input
            value={email}
            readOnly
            className="w-full p-2 sm:p-4 border rounded-md bg-gray-200 text-sm sm:text-md"
          /> */}
          <div
            className="flex justify-between gap-1 sm:gap-2"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                name="otp-${index}"
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-md sm:text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-black border-black"
                required
              />
            ))}
          </div>
          <p className="text-end text-sm sm:text-md text-white hover:underline cursor-pointer mb-4 sm:mb-6">
            Resend code
          </p>
          <button
            type="submit"
            className="w-full py-2 sm:py-2 bg-white text-black rounded-md hover:bg-black hover:text-white duration-500 ease-in-out text-sm sm:text-md font-semibold"
          >
            Verify
          </button>
        </form>
        {error && (
          <div className="mt-4 text-red-500 text-center text-sm sm:text-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyOTP;
