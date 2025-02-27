import React, { useState } from "react";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  return (
    <div className="bg-[url(/src/img/backgroundPF.jpg)] flex items-center justify-center min-h-screen bg-cover bg-center">
      <div className="container mt-1 mx-auto">
        <header className="absolute top-1 left-12 p-3">
          <h1 className="text-2xl font-bold text-white p-2">Profile</h1>
          <h1 className="text-xl font-bold text-white p-2 pb-5 capitalize">Your Profile</h1>
          <hr className="bg-white border-white text-white border-2 px-4 w-[1360px]" />
          <div className="pt-20">
            {["S", "T", "Y", "L", "E", "X"].map((char, index) => (
              <h1 key={index} className="text-4xl font-extrabold text-white p-4">
                {char}
              </h1>
            ))}
          </div>
        </header>

        <div className="flex justify-center items-center min-h-screen gap-10 p-10 pt-40">
          {/* ข้อมูลโปรไฟล์และฟอร์มแก้ไข */}
          <div className="absolute top-[282px] right-[500px] w-[830px] h-[305px] flex-1 bg-white bg-opacity-85 p-6 rounded-xl border border-gray-400 flex gap-20">
            <div className="absolute top-[20px] right-[580px]">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black">Name & First Name</h2>
              <p className="text-black text-lg"><strong>Name:</strong> ทัช</p>
              <p className="text-black text-lg"><strong>First Name:</strong> อารักษ์</p>
              <p className="text-black text-lg"><strong>Last Name:</strong> คำมุงคุล</p>
              </div>
            </div>

            <div className="absolute top-[20px] right-[30px]">
              <h2 className="text-2xl font-bold text-black ">Edit Name , First Name & Picture</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 pt-4">
                  <h2 className="text-m font-bold w-24 text-black">Name:</h2>
                  <input className="border p-2 flex-1 rounded-lg" type="text" placeholder="Name" />
                </div>
                <div className="flex items-center gap-3">
                  <h2 className="text-m font-bold w-24 text-black">First Name:</h2>
                  <input className="border p-2 flex-1 rounded-lg" type="text" placeholder="First Name" />
                </div>
                <div className="flex items-center gap-3">
                  <h2 className="text-m font-bold w-24 text-black">Last Name:</h2>
                  <input className="border p-2 flex-1 rounded-lg" type="text" placeholder="Last Name" />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button className="bg-white text-blue-500 px-6 py-2 rounded-lg border-2 border-blue-500">Image</button>
                <button className="bg-white text-red-500 px-6 py-2 rounded-lg border-2 border-red-500">Cancel</button>
                <button className="bg-white text-green-500 px-7 py-2 rounded-lg border-2 border-green-500">Save</button>
              </div>
            </div>
          </div>

          {/* รูปโปรไฟล์ */}
          <div className="absolute top-[282px] right-[50px] w-[415px] h-[305px] bg-white bg-opacity-85 rounded-lg shadow-lg flex flex-col items-center p-4">
          <div className="relative w-full h-screen ">
            <div className="absolute top-[-100px] right-[60px] w-[264px] h-[264px] rounded-full overflow-hidden border-2 border-white shadow-md">
              <img src="/src/img/3.jpg" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>

            <div className="flex gap-8 mt-4 w-full justify-center">
              <div className="flex flex-col items-center">
                <p className="text-black text-sm font-semibold">Use Amount</p>
                <p className="text-black text-2xl font-bold">10</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-black text-sm font-semibold">Cancel Amount</p>
                <p className="text-black text-2xl font-bold">3</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
