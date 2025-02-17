import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import Layout from "./components/Layout";
import axios from "axios";

const Managment = () => {
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
              managment
            </h1>
          </header>
          <div className="flex justify-between">
            {/* Barber Section */}
            <div className="ml-10 w-1/2 mr-2">
              <h1 className="text-xl font-bold text-gray-800 p-2 capitalize">
                Barber
              </h1>
              <hr className="bg-black border-black text-black border px-2 mb-5" />
              <div
                className="bg-black shadow-md rounded-lg border p-4 h-auto flex"
              >
                <div className="bg-[url('/src/img/14.jpg')] bg-cover bg-center h-auto w-[200px] rounded-lg"></div>
                <div className="text-xl text-white  p-2 flex-1">
                  <p className="uppercase font-bold">ARCHIE WILLIAMS</p>
                  <p className="mt-3">
                    A versatile master of haircuts of any complexity who loves
                    his job.
                  </p>
                  <p className="mt-3">Position : Barber</p>
                  <p className="mt-3">Experience : 11 years</p>
                  <div className="flex mt-3  justify-end ">
                    <button className="bg-[#00BA9A] text-white uppercase px-6 py-2 rounded-md  hover:bg-green-900 transition duration-300 w-[150px] mr-3">
                        open
                    </button>
                    <button className="bg-[#CC2F22] text-white uppercase px-6 py-2 rounded-md  hover:bg-red-900 transition duration-300 w-[150px]">
                        close
                    </button>
                  </div>
                    
                </div>
                
              </div>
            </div>

            {/* Date & Time Section */}
            <div className="mr-10 w-1/2">
              <h1 className="text-xl font-bold text-gray-800 p-2 capitalize">
                service
              </h1>
              <hr className="bg-black border-black text-black border px-2 mb-5" />
              <div className="flex flex-col">
                
                
                <div className="flex  mb-4">
                    <div className="bg-[#242529] text-white px-6 py-2 mr-10 rounded-md w-full">
                        Men's haircut
                    </div>
                    
                    <button className="bg-[#00BA9A] text-white uppercase px-6 py-2 rounded-md  hover:bg-green-900 transition duration-300 w-[150px] mr-3">
                        open
                    </button>
                    <button className="bg-[#CC2F22] text-white uppercase px-6 py-2 rounded-md  hover:bg-red-900 transition duration-300 w-[150px]">
                        close
                    </button>
                  
                </div>

                {/* Time Selector with Animation */}
                <div className="flex items-center space-x-2 mb-4">
                  
                </div>

                <div className="flex justify-center mb-4">
                    <button className="bg-[#242529] text-white uppercase px-6 py-2 rounded-md  hover:bg-gray-700 transition duration-300 w-full">
                        managment barber
                    </button>
                </div>
                <div className="flex justify-center">
                    <button className="bg-[#242529] text-white uppercase px-6 py-2 rounded-md  hover:bg-gray-700 transition duration-300 w-full">
                        managment service
                    </button>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Managment;
