import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import Layout from "./components/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";  

const Test_service = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false); // ควบคุมแอนิเมชันตอนโหลด (เด้งจากข้างบน)
  const [opacity, setOpacity] = useState(1); // ควบคุมการจางหายตอนเลื่อน

  useEffect(() => {
    axios
      .get(`${apiUrl}/services/`)
      .then((response) => {
        const activeService = response.data.filter((service) => service.status === "Active");
        setServices(activeService);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });

    // ตั้งค่าแอนิเมชันเริ่มต้นให้เด้งลงมา
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  // ตรวจจับการเลื่อนหน้าเพื่อปรับ opacity
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // คำนวณ opacity จากตำแหน่ง scroll (0 = จางหาย, 1 = ชัด)
      const newOpacity = Math.max(0, 1 - scrollPosition / 100); // จางหายเมื่อเลื่อนลง 200px
      setOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // ล้าง event listener
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
        <div className="relative h-[600px] w-full justify-center flex">
          <div className="absolute inset-0 bg-[url(/src/img/service2.jpg)] bg-cover bg-fixed bg-center">
            <div className="absolute inset-0 bg-black/50 brightness-50"></div>
          </div>

          <div
            className={`relative justify-center items-center flex w-screen text-white mt-16 italic transition-all duration-1000 ${
              isLoaded ? "translate-y-0" : "translate-y-[-100%]"
            }`}
            style={{ opacity: opacity }} // ใช้ style เพื่อควบคุม opacity แบบ dynamic
          >
            <div className="grid">
              <h1
                className={`text-[1rem] sm:text-[1rem] md:text-[1rem] lg:text-[2rem] xl:text-[4rem] 2xl:text-[6rem] font-extrabold inline-block`}
              >
                Look great every day
              </h1>
              <h1
                className={`text-[1rem] sm:text-[1rem] md:text-[1rem] lg:text-[1rem] xl:text-[2rem] 2xl:text-[2rem] font-thin inline-block text-center`}
              >
                choose our services
              </h1>
            </div>
          </div>
        </div>

        <div className="container mt-24 mx-auto">
          <header className="mb-2 text-start">
            <h1 className="text-2xl font-bold text-gray-800 p-2 ml-20 uppercase">
              booking
            </h1>
          </header>
          <div className="flex">
            <div className="ml-10 w-full mr-2">
              <h1 className="text-xl font-bold text-gray-800 p-2 capitalize">
                service
              </h1>
              <hr className="bg-black border-black text-black border px-2 mb-5 w-full" />

              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-black shadow-md rounded-2xl border p-4 h-auto flex mb-5 ml-2 transition duration-300 hover:-translate-y-3 hover:shadow-lg cursor-pointer"
                >
                  <div className="flex items-center h-full w-[170px] mr-2">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="rounded-lg h-[170px] w-[170px] object-cover"
                    />
                  </div>
                  <div className="text-white px-2 flex-1">
                    <p className="uppercase font-bold text-2xl">{service.name}</p>
                    <p className="mt-1 text-sm">คำอธิบาย {service.description}</p>
                    <div className="mt-1 flex">
                      <span className="mr-2 capitalize">เวลาบริการ :</span>
                      {service.duration} นาที
                    </div>
                    <div className="mt-1 flex items-center">
                      <span className="mr-2 capitalize">ราคา :</span>
                      <span className="mr-2 capitalize bg-white text-black px-2 py-1 rounded-2xl">
                        {service.price} ฿
                      </span>
                    </div>
                    <div className="flex mt-1 justify-end">
                      <button
                        className="bg-white text-black uppercase px-6 py-2 rounded-md hover:bg-slate-700 hover:text-white transition duration-300 w-[150px] mr-3"
                        onClick={() => handleSelect(service.id)}
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
        <div className="py-28"></div>
      </Layout>
    </div>
  );
};

export default Test_service;