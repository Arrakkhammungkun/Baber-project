// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    nick_name: "",
    phone_number: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password < 8) {
      setMessage("password must be at least 8 character long");
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Resgistration succenful ");

        setFormData({
          first_name: "",
          last_name: "",
          nick_name: "",
          phone_number: "",
          email: "",
          password: "",
        });
      } else {
        setMessage(data.detail || "Error: Unable to register");
      }
    } catch (error) {
      setMessage("Error: Unable to register");
      console.error(error);
    }
  };

  return (
    <>
      <div className="register-container min-h-screen flex items-center justify-center bg-[url(/src/img/login.png)] bg-cover bg-center h-screen w-full">
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
        <div className="relative mx-auto py-6  px-10 bg-white/25 backdrop-blur-sm rounded-3xl shadow-md w-full max-w-md ">
          <h1 className="text-center text-3xl text-white font-bold mb-6">
            {" "}
            Register
          </h1>
          <form onSubmit={handleSubmit} className="flex-col   ">
            <div className="rounded-md">
              <label className="text-white">First Name</label>
              <input
                type="text"
                name="first_name"
                className="w-full p-1 border border-gray-300 rounded-md shadow-gray-800 shadow-md"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="rounded-md">
              <label className="text-white">Last Name</label>
              <input
                type="text"
                name="last_name"
                className="w-full p-1 border border-gray-300 rounded-md shadow-gray-800 shadow-md"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="rounded-md">
              <label className="text-white">Nickname</label>
              <input
                type="text"
                name="nick_name"
                className="w-full p-1 border border-gray-300 rounded-md shadow-gray-800 shadow-md"
                value={formData.nick_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="rounded-md">
              <label className="text-white">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                className="w-full p-1 border border-gray-300 rounded-md shadow-gray-800 shadow-md"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>

            <div className="rounded-md">
              <label className="text-white">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-1 border border-gray-300 rounded-md shadow-gray-800 shadow-md"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="rounded-md">
              <label className="text-white">Password</label>
              <input
                type="password"
                name="password"
                className="w-full p-1 border border-gray-300 rounded-md shadow-gray-800 shadow-md"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className=" w-auto text-sm py-1 px-5 bg-white text-black font-bold  rounded-md hover:bg-black hover:text-white "
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {message && <p>{message}</p>}
      </div>
    </>
  );
}
