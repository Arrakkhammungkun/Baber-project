import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import Layout from "./components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";  

const Test_service = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();  

  useEffect(() => {
    axios
      .get(`${apiUrl}/services/`)
      .then((response) => {
        setServices(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, []);

  // ฟังก์ชันสำหรับการนำทาง
  const handleSelect = (serviceId) => {
    if (serviceId) {
      console.log("Navigating to:", `/test_service/${serviceId}/bookingbarber`);  // ตรวจสอบค่า serviceId ที่จะส่ง
      navigate(`/test_service/${serviceId}/bookingbarber`);
    } else {
      console.error("Invalid serviceId");  // ถ้า serviceId เป็น undefined หรือไม่มีค่า
    }
  };

  return (
    <div>
      <Layout>
        <div className="container mt-24 mx-auto">
          <header className="mb-2 text-start">
            <h1 className="text-2xl font-bold text-gray-800 p-2 ml-20 uppercase">
              booking
            </h1>
          </header>
          <div className="flex">
            {/* Barber Section */}
            <div className="ml-10 w-full mr-2">
              <h1 className="text-xl font-bold text-gray-800 p-2 capitalize">
                service
              </h1>
              <hr className="bg-black border-black text-black border px-2 mb-5 w-full" />

              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-black shadow-md rounded-2xl border p-4 h-auto flex mb-5 ml-2 transition duration-300 hover:-translate-y-3 hover:shadow-lg cursor-pointer "
                >
                  <div className="flex items-center h-full w-[170px] mr-2">
                    <img 
                      src={service.image_url} 
                      alt={service.name} 
                      className="rounded-lg h-[170px] w-[170px] object-cover"
                    />
                  </div>
                  <div className=" text-white px-2 flex-1">
                    <p className="uppercase font-bold text-2xl">{service.name}</p>
                    <p className="mt-1 text-sm">คำอธิบาย {service.description}</p>

                    <div className="mt-1 flex">
                      <span className="mr-2 capitalize">เวลาบริการ :</span>
                      {service.duration} นาที
                    </div>
                    <div className="mt-1 flex items-center">
                      <span className="mr-2 capitalize ">ราคา :</span>
                      <span className="mr-2 capitalize bg-white text-black px-2 py-1 rounded-2xl">{service.price} ฿</span>
                      
                    </div>
                    <div className="flex mt-1 justify-end">
                      <button 
                        className="bg-white text-black uppercase px-6 py-2 rounded-md hover:bg-slate-700 hover:text-white transition duration-300 w-[150px] mr-3"
                        onClick={() => handleSelect(service.id)}  // เรียกฟังก์ชันเมื่อคลิก
                      >
                        select
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="py-28">

        </div>
      </Layout>
    </div>
  );
};

export default Test_service;
