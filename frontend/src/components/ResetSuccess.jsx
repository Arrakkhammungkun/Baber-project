import { Link } from 'react-router-dom';
import './ResetSuccess.css';
const ResetSuccess = () => {
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
          <Link to="/login" className="mt-6 w-full">
            <button className="w-full py-2 px-12 bg-[#4595ED] text-white font-bold rounded-3xl hover:bg-[#2F80ED] hover:text-white ease-in-out duration-300">
              Continue
            </button>
          </Link>
        </div>
      </div>


    </div>
  );
};

export default ResetSuccess;