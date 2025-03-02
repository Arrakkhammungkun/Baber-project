/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const items = [
    "/img/3.jpg",
    "/img/2.jpg",
    "/img/5.jpg",
    "/img/6.jpg",
    "/img/7.jpg",
    "/img/8.jpg",
    "/img/9.jpg",
  ];
  const itemsa = [
    "/img/2.jpg",
    "/img/10.jpg",
    "/img/11.jpg",
    "/img/12.jpg",
    "/img/13.jpg",
    "/img/3.jpg",
    "/img/4.jpg",
  ];

  useEffect(() => {
    fetch(`${apiUrl}/Member/`)
      .then((response) => response.json())
      .catch((error) => console.error("Error:", error));

    const handleScroll = () => {
      setScrolling(window.scrollY > 150);
    };

    window.addEventListener("scroll", handleScroll);

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 3000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <Layout>
        <div className="h-full overflow-hidden">
          {/* Hero Section */}
          <div className="bg-[url(/img/welcome.jpg)] bg-cover bg-center h-screen w-full flex items-center justify-center bg-fixed">
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative flex flex-col w-full px-4 sm:px-6 md:px-10 text-white">
              <div className="grid grid-cols-2 gap-2 sm:gap-4 tracking-tighter">
                <h1
                  className={`text-2xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-[10rem] 2xl:text-[12rem] font-extrabold ${
                    scrolling
                      ? "animate-slide-left-reverse"
                      : "animate-slide-right"
                  }`}
                >
                  WELCOME
                </h1>
                <h1
                  className={`text-2xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-[10rem] 2xl:text-[12rem] font-extrabold text-end ${
                    scrolling
                      ? "animate-slide-right-reverse"
                      : "animate-slide-left"
                  }`}
                >
                  TO
                </h1>
                <h1
                  className={`text-2xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-[10rem] 2xl:text-[12rem] font-extrabold ${
                    scrolling
                      ? "animate-slide-left-reverse"
                      : "animate-slide-right"
                  }`}
                >
                  THE
                </h1>
                <h1
                  className={`text-2xl sm:text-4xl md:text-6xl lg:text-8xl xl:text-[10rem] 2xl:text-[12rem] font-extrabold ${
                    scrolling
                      ? "animate-slide-right-reverse"
                      : "animate-slide-left"
                  }`}
                >
                  STYLEX
                </h1>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6 md:px-8">
            <h1 className="text-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold mb-8 sm:mb-12">
              STYLEX
            </h1>
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold uppercase mb-6 sm:mb-8">
              STORY
            </h1>

            {/* Story Section */}
            <div className="flex flex-col md:flex-row justify-between gap-4 sm:gap-6 md:gap-8 mb-10">
              <div className="shadow-xl shadow-gray-400 bg-[url(/img/3.jpg)] bg-cover bg-center w-full md:w-1/2 h-40 sm:h-48 md:h-56 lg:h-64 xl:h-80 rounded-lg"></div>
              <div className="w-full md:w-1/2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                STYLEX ไม่เพียงแต่เป็นร้านตัดผมที่ให้บริการออกแบบทรงผมเท่านั้น
                แต่ยังมาพร้อมกับระบบออนไลน์ที่ทันสมัยเพื่อความสะดวกสบายของลูกค้า
                ผ่านเว็บไซต์ของเรา คุณสามารถเลือกบริการที่ต้องการ เช่น การตัดผม
                ทำสี หรือการบำรุงเส้นผม
                พร้อมเลือกช่างที่คุณชื่นชอบได้ตามความสะดวก
                นอกจากนี้ยังสามารถดูคิวการจองและเวลาที่ว่าง
                เพื่อให้คุณวางแผนได้อย่างมีประสิทธิภาพและไม่ต้องรอนาน
                เราต้องการให้การใช้บริการที่ STYLEX เป็นเรื่องง่ายและสะดวกสบาย
                ตั้งแต่การจองออนไลน์ไปจนถึงการสัมผัสประสบการณ์การดูแลเส้นผมที่ดีที่สุดในทุกขั้นตอน
              </div>
            </div>
            <div className="flex flex-col md:flex-row-reverse justify-between gap-4 sm:gap-6 md:gap-8 mb-10">
              <div className="shadow-xl shadow-gray-400 bg-[url(/img/4.jpg)] bg-cover bg-center w-full md:w-1/2 h-40 sm:h-48 md:h-56 lg:h-64 xl:h-80 rounded-lg"></div>
              <div className="w-full md:w-1/2 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                STYLEX
                เกิดขึ้นจากความหลงใหลในศิลปะการสร้างสรรค์ทรงผมและการดูแลเส้นผมอย่างมืออาชีพ
                เราเริ่มต้นจากร้านเล็กๆ ด้วยความตั้งใจที่จะให้บริการที่เหนือกว่า
                พร้อมให้คำแนะนำส่วนตัวจากทีมช่างมืออาชีพ
                ที่พร้อมออกแบบทรงผมที่เหมาะสมและสอดคล้องกับบุคลิกของลูกค้าแต่ละคน
                เราเชื่อว่าเส้นผมที่ดีไม่เพียงแต่ทำให้คนสวยขึ้น
                แต่ยังเสริมสร้างความมั่นใจให้กับทุกคนในการเผชิญโลกภายนอก
              </div>
            </div>

            {/* Service Section */}
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold uppercase mb-6 sm:mb-8">
              SERVICE
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-10">
              {[
                {
                  img: "/src/img/salon.png",
                  title: "hair cut",
                  desc: "ตัดผมสวย โดนใจ ด้วยช่างมืออาชีพที่ใส่ใจคุณ",
                },
                {
                  img: "/src/img/razor.png",
                  title: "shaving",
                  desc: "เปลี่ยนทุกสัมผัสให้เรียบเนียนในแบบที่คุณมั่นใจ",
                },
                {
                  img: "/src/img/hair-clipper.png",
                  title: "trimming",
                  desc: "เติมความเป๊ะในทุกเส้น สร้างลุคที่ลงตัว",
                },
                {
                  img: "/src/img/comb.png",
                  title: "style&care",
                  desc: "สร้างสไตล์ที่ใช่ พร้อมดูแลเส้นผมให้สุขภาพดี",
                },
              ].map((service, index) => (
                <div
                  key={index}
                  className="bg-[#242529] max-w-[250px] w-full h-60 sm:h-64 md:h-72 lg:h-80 xl:h-[20rem] flex flex-col items-center p-3 sm:p-4 shadow-xl shadow-gray-400 transition ease-out hover:-translate-y-6 hover:scale-100 duration-300 rounded-lg mx-auto"
                >
                  <div
                    className="bg-contain bg-no-repeat bg-center w-full h-24 sm:h-28 md:h-32 lg:h-36 xl:h-40"
                    style={{ backgroundImage: `url(${service.img})` }}
                  ></div>
                  <div className="text-white text-center mt-2 sm:mt-3">
                    <h1 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium uppercase">
                      {service.title}
                    </h1>
                    <p className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-bold mt-1">
                      {service.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mb-10 px-4 sm:px-0">
              <Link to="test_service">
                <button className="w-auto bg-white text-black border-2 border-black p-2 sm:p-3 hover:bg-black hover:text-white transition ease-in-out duration-300 rounded-sm text-sm sm:text-base md:text-lg">
                  Book Now
                </button>
              </Link>
            </div>

            {/* Gallery Section */}
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold uppercase mb-6 sm:mb-8">
              ALL GALLERY
            </h1>
            <div className="w-full gallery-container mb-10">
              <div className="slider">
                <div className="slider-track">
                  {items.concat(items).map((item, index) => (
                    <div
                      key={index}
                      className="slider-item"
                      style={{ backgroundImage: `url(${item})` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full gallery-container">
              <div className="slider">
                <div className="slider-tracka">
                  {itemsa.concat(itemsa).map((item1, index1) => (
                    <div
                      key={index1}
                      className="slider-item"
                      style={{ backgroundImage: `url(${item1})` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="py-12 sm:py-16 md:py-24"></div>
        </div>
      </Layout>

      {/* ลบ jsx ออก */}
      <style>{`
        @keyframes slideFromRight {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideFromLeft {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideLeftReverse {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(-100%);
            opacity: 0;
          }
        }
        @keyframes slideRightReverse {
          0% {
            transform: translateX(0);
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        @keyframes slideInfinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes slideLeftToRight {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-slide-right {
          animation: slideFromRight 1s ease-out forwards;
        }
        .animate-slide-left {
          animation: slideFromLeft 1s ease-out forwards;
        }
        .animate-slide-left-reverse {
          animation: slideLeftReverse 1s ease-out forwards;
        }
        .animate-slide-right-reverse {
          animation: slideRightReverse 1s ease-out forwards;
        }

        .gallery-container {
          width: 100%;
          overflow: hidden;
          display: flex;
          justify-content: center;
        }
        .slider {
          width: 100%;
          overflow: hidden;
        }
        .slider-track {
          display: flex;
          animation: slideInfinite 30s linear infinite alternate;
        }
        .slider-tracka {
          display: flex;
          animation: slideLeftToRight 30s linear infinite alternate;
        }
        .slider-item {
          min-width: 200px;
          margin-right: 8px;
          flex-shrink: 0;
          height: 150px;
          border-radius: 0.5rem;
          background-size: cover;
          background-position: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        @media (min-width: 640px) {
          .slider-item {
            min-width: 250px;
            height: 180px;
            margin-right: 12px;
          }
        }
        @media (min-width: 768px) {
          .slider-item {
            min-width: 300px;
            height: 200px;
          }
        }
        @media (min-width: 1024px) {
          .slider-item {
            min-width: 350px;
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
