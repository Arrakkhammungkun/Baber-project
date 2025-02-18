import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import Layout from "./components/Layout";
import axios from "axios";

const Bookingbarber = () => {
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
<div className="bg-gray-100">
      {/* Header */}
      <header className="bg-cover bg-center h-64 flex items-center justify-center text-white text-4xl font-bold" style={{ backgroundImage: `url('https://media.istockphoto.com/id/1457501940/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%A0%E0%B8%B2%E0%B8%9E%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%E0%B8%95%E0%B8%B1%E0%B8%94%E0%B8%9C%E0%B8%A1%E0%B8%AA%E0%B8%B8%E0%B8%94%E0%B8%AB%E0%B8%A3%E0%B8%B9%E0%B8%9E%E0%B8%A3%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B8%95%E0%B8%81%E0%B9%81%E0%B8%95%E0%B9%88%E0%B8%87%E0%B8%A0%E0%B8%B2%E0%B8%A2%E0%B9%83%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B8%94%E0%B8%B5.jpg?s=612x612&w=0&k=20&c=YIAENZbAdos8Mdjayg_PytCD-Ll20Onex5H2YTcz2L8=')` }}>
        <div>
          <h1>Look great every day</h1>
          <p className="text-sm mt-2">choose our services</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Service</h2>
          <div className="flex items-center">
            <input type="text" placeholder="Search" className="p-2 rounded-l-lg border border-gray-300 focus:outline-none" />
            <button className="bg-black text-white p-2 rounded-r-lg">🔍</button>
          </div>
        </div>
        {/* Service Cards */}
        <div className="space-y-4">
          <div className="bg-gray-800 text-white p-4 rounded-lg flex">
            <img src="path/to/men-haircut.jpg" alt="Men's haircut" className="w-24 h-24 rounded-lg mr-4" />
            <div className="flex-1">
              <h3 className="text-lg font-bold">Men's haircut</h3>
              <p className="text-sm">Description: A professional haircut tailored to your face shape and style.</p>
              <p className="text-sm mt-2"><strong>Price Range:</strong> 500 - 1,500 ฿</p>
              <p className="text-sm"><strong>Approx. Duration:</strong> 20 - 40 Minute</p>
            </div>
            <button className="bg-white text-black px-4 py-2 rounded-lg">Select</button>
          </div>
          {/* คุณสามารถเพิ่ม Service Card สำหรับ Women's haircut ที่นี่ */}
        </div>
      </div>
    </div>
  );
}
export default Bookingbarber;