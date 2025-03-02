import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "./components/Layout";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const Test_service = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false); // ควบคุมแอนิเมชันตอนโหลด
  const [opacity, setOpacity] = useState(1); // ควบคุมการจางหายตอนเลื่อน

  useEffect(() => {
    axios
      .get(`${apiUrl}/services/`)
      .then((response) => {
        const activeService = response.data.filter(
          (service) => service.status === "Active"
        );
        setServices(activeService);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });

    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const newOpacity = Math.max(0, 1 - scrollPosition / 100);
      setOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelect = (serviceId) => {
    if (serviceId) {
      console.log("Navigating to:", `/test_service/${serviceId}/bookingbarber`);
      navigate(`/test_service/${serviceId}/bookingbarber`);
    } else {
      console.error("Invalid serviceId");
    }
  };

  return (
    <div>
      <Layout>
        {/* Hero Section */}
        <div className="relative h-[400px] sm:h-[500px] md:h-[600px] w-full flex justify-center">
          <div className="absolute inset-0 bg-[url(/src/img/service2.jpg)] bg-cover bg-fixed bg-center">
            <div className="absolute inset-0 bg-black/50"></div>
          </div>

          <div
            className={`relative flex justify-center items-center w-full text-white mt-12 sm:mt-16 italic transition-all duration-1000 ${
              isLoaded ? "translate-y-0" : "translate-y-[-100%]"
            }`}
            style={{ opacity: opacity }}
          >
            <div className="text-center px-4">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold">
                Look great every day
              </h1>
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-thin mt-2">
                choose our services
              </h1>
            </div>
          </div>
        </div>

        {/* Service Section */}
        <div className="container mt-16 sm:mt-20 md:mt-24 mx-auto px-4">
          <header className="mb-4 text-center sm:text-left">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 p-2 uppercase">
              Booking
            </h1>
          </header>

          <div className="w-full">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 p-2 capitalize text-center sm:text-left">
              Service
            </h1>
            <hr className="bg-black border-black border mb-5 mx-auto w-3/4 sm:w-full" />

            {services.map((service) => (
              <div
                key={service.id}
                className="bg-black shadow-md rounded-2xl border p-4 mx-auto max-w-6xl flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-5 transition duration-300 hover:-translate-y-3 hover:shadow-lg cursor-pointer"
              >
                {/* Image */}
                <div className="w-full sm:w-40 md:w-48 flex-shrink-0">
                  <img
                    src={service.image_url}
                    alt={service.name}
                    className="rounded-lg w-full h-32 sm:h-40 md:h-48 object-cover"
                  />
                </div>

                {/* Details */}
                <div className="text-white flex-1 text-center sm:text-left px-2">
                  <p className="text-base sm:text-lg md:text-xl font-bold uppercase">
                    {service.name}
                  </p>
                  <p className="mt-2 text-xs sm:text-sm md:text-base">
                    คำอธิบาย {service.description}
                  </p>
                  <p className="mt-2 text-xs sm:text-sm flex flex-col sm:flex-row justify-center sm:justify-start gap-1">
                    <span className="capitalize">เวลาบริการ:</span>
                    <span>{service.duration} นาที</span>
                  </p>
                  <p className="mt-2 text-xs sm:text-sm flex flex-col sm:flex-row justify-center sm:justify-start gap-1">
                    <span className="capitalize">ราคา:</span>
                    <span className="bg-white text-black px-2 py-1 rounded-2xl">
                      {service.price} ฿
                    </span>
                  </p>

                  {/* Button */}
                  <div className="mt-4 flex justify-center sm:justify-end">
                    <button
                      className="bg-white text-black uppercase px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-slate-700 hover:text-white transition duration-300 w-full max-w-xs sm:w-32 sm:max-w-none"
                      onClick={() => handleSelect(service.id)}
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="py-16 sm:py-20 md:py-28"></div>
      </Layout>
    </div>
  );
};

export default Test_service;