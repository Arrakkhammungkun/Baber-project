import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import Layout from "./components/Layout";
import axios from "axios";

const Booking_service = () => {
  const [services, setServices] = useState([]);
  


  useEffect(() => {
    axios
      .get(`${apiUrl}/services/`)
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, []);

  return (
    <div>
      <Layout>
        <div className="container mt-24 mx-auto">
          <header className="mb-2 text-start">
            <h1 className="text-2xl font-bold text-gray-800 p-2 ml-20 uppercase">
              booking
            </h1>
          </header>
          <div className="flex ">
            {/* Barber Section */}
            <div className="ml-10 w-full mr-2">
              <h1 className="text-xl font-bold text-gray-800 p-2 capitalize">
                service
              </h1>
              <hr className="bg-black border-black text-black border px-2 mb-5 w-full" />
              <div
                className="bg-black shadow-md rounded-lg border p-4 h-auto flex"
              >
                <div className="flex items-center h-auto w-[200px] mr-2">
                    <img src="./src/img/men'shaircut.jpg" alt="./src/img/14.jpg" className="rounded-lg h-[200px] w-[200px] object-cover"/>
                </div>
                <div className="text-xl text-white p-2 flex-1">
                  <p className="uppercase font-bold">men's haircut</p>
                  <p className="mt-3">
                  A professional haircut tailored to your face shape and style
                  </p>
                  <p className="mt-3 flex"><p className="mr-2 capitalize">price :</p>500 - 1,500 ฿</p>
                  <p className="mt-3 flex"><p className="mr-2 capitalize">time :</p>20 - 40 Minute</p>
                  <div className="flex mt-3  justify-end ">
                    <button className="bg-white text-black uppercase px-6 py-2 rounded-md  hover:bg-slate-700 hover:text-white  transition duration-300 w-[150px] mr-3">
                        select
                    </button>
                  </div>
                    
                </div>
                
              </div>
            </div>

            
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Booking_service;
