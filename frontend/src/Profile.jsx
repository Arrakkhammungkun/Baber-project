import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { token,user } = useAuth();

  return (
    <div className="bg-[url(/src/img/welcome.jpg)] bg-cover bg-center min-h-screen flex items-center justify-center p-4">
      <div className="container mx-auto max-w-7xl w-full">
        {/* Header */}
        <header className="mb-6 sm:mb-8 md:mb-12 lg:mb-16 px-4">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white p-2">Profile</h1>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white p-2 pb-5 capitalize">Your Profile</h1>
          <hr className="bg-white border-white border-2 w-full" />
        </header>

        {/* Main Content */}
        <div className=" flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-10 justify-center items-center min-h-[calc(100vh-200px)] relative">
          {/* STYLEX Vertical */}
          <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 pl-2 sm:pl-4">
            <div className="flex flex-col items-center justify-center">
              {["S", "T", "Y", "L", "E", "X"].map((char, index) => (
                <h1 
                  key={index} 
                  className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white p-1 sm:p-2 md:p-3 leading-tight"
                >
                  {char}
                </h1>
              ))}
            </div>
          </div>

          {/* Profile Info Container */}
          <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4 sm:gap-6 pl-0 sm:pl-12 md:pl-16">
            {/* Profile Info and Edit Form */}
            <div className="w-full bg-white bg-opacity-85 p-4 sm:p-6 rounded-xl border border-gray-400 flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-10">
              {/* Profile Info */}
              <div className="flex-1">
                <div className="space-y-3 sm:space-y-4 md:space-y-6">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black">Name & First Name</h2>
                  <p className="text-black text-sm sm:text-base md:text-lg"><strong>Name:</strong> ทัช</p>
                  <p className="text-black text-sm sm:text-base md:text-lg"><strong>First Name:</strong> อารักษ์</p>
                  <p className="text-black text-sm sm:text-base md:text-lg"><strong>Last Name:</strong> คำมุงคุล</p>
                </div>
              </div>

              {/* Edit Form */}
              <div className="flex-1">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-3 sm:mb-4">Edit Name & Picture</h2>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <h2 className="text-xs sm:text-sm md:text-base font-bold w-20 sm:w-24 text-black">Name:</h2>
                    <input 
                      className="border p-1 sm:p-2 flex-1 rounded-lg w-full" 
                      type="text" 
                      placeholder="Name" 
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <h2 className="text-xs sm:text-sm md:text-base font-bold w-20 sm:w-24 text-black">First Name:</h2>
                    <input 
                      className="border p-1 sm:p-2 flex-1 rounded-lg w-full" 
                      type="text" 
                      placeholder="First Name" 
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <h2 className="text-xs sm:text-sm md:text-base font-bold w-20 sm:w-24 text-black">Last Name:</h2>
                    <input 
                      className="border p-1 sm:p-2 flex-1 rounded-lg w-full" 
                      type="text" 
                      placeholder="Last Name" 
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4">
                  <button className="bg-white text-blue-500 px-3 sm:px-4 md:px-6 py-1 sm:py-2 rounded-lg border-2 border-blue-500  hover:bg-blue-500 hover:text-white ease-in-out duration-300">Image</button>
                  <button className="bg-white text-red-500 px-3 sm:px-4 md:px-6 py-1 sm:py-2 rounded-lg border-2 border-red-500 hover:bg-red-500 hover:text-white ease-in-out duration-300">Cancel</button>
                  <button className="bg-white text-green-500 px-3 sm:px-4 md:px-6 py-1 sm:py-2 rounded-lg border-2 border-green-500 hover:bg-green-500 hover:text-white ease-in-out duration-300">Save</button>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Picture and Stats */}
          <div className="w-full max-w-md bg-white bg-opacity-85 rounded-lg shadow-lg flex flex-col items-center p-4 sm:p-6">
            <div className="relative w-32 sm:w-40 md:w-52 h-32 sm:h-40 md:h-52 mb-3 sm:mb-4">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white shadow-md">
                <img src="/src/img/3.jpg" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex gap-4 sm:gap-6 md:gap-8 w-full justify-center">
              <div className="flex flex-col items-center">
                <p className="text-black text-xs sm:text-sm font-semibold">Use Amount</p>
                <p className="text-black text-lg sm:text-xl md:text-2xl font-bold">10</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-black text-xs sm:text-sm font-semibold">Cancel Amount</p>
                <p className="text-black text-lg sm:text-xl md:text-2xl font-bold">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;