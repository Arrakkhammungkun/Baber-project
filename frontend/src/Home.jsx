/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from 'react';
import Layout from './components/Layout';

const apiUrl = import.meta.env.VITE_API_URL;

function Home() {
  const [setMembers] = useState([]);
  const [setCurrentIndex] = useState(0);
  const [scrolling, setScrolling] = useState(false);
  const items = ["/src/img/3.jpg", 
    "/src/img/2.jpg", 
    "/src/img/5.jpg", 
    "/src/img/6.jpg", 
    "/src/img/7.jpg",
    "/src/img/8.jpg",
    "/src/img/9.jpg",
  ]; // Add all your image URLs
  const itemsa = ["/src/img/2.jpg", 
    "/src/img/10.jpg", 
    "/src/img/11.jpg", 
    "/src/img/12.jpg", 
    "/src/img/13.jpg",
    "/src/img/3.jpg",
    "/src/img/4.jpg",
  ];
  
  useEffect(() => {
    fetch(`${apiUrl}/Member/`)
      .then((Response) => Response.json())
      .then((data) => setMembers(data))
      .catch((error) => console.error('Error:', error));

    const handleScroll = () => {
      if (window.scrollY > 150) {
        setScrolling(true);  
      } else {
        setScrolling(false); 
      }
    };

    window.addEventListener('scroll', handleScroll);

    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 3000); // Change every 3 seconds

    return () => {
      window.removeEventListener('scroll', handleScroll); // Cleanup
      clearInterval(intervalId); // Cleanup the interval when component is unmounted
    };
  }, []);

  

  return (
    <div>
      <Layout>
        <div className="h-full overflow-hidden">
          <div className="bg-[url(/src/img/welcome.jpg)] bg-cover bg-center h-screen w-full flex items-center justify-center bg-fixed">
            <div className="flex flex-col w-screen mx-10 text-white">
              <div className="grid grid-cols-2 tracking-[-0.75rem]">
                <h1 className={`text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[11rem] 2xl:text-[12rem] font-extrabold inline-block mb-4 ${scrolling ? 'animate-slide-left-reverse' : 'animate-slide-right'}`}>
                  WELCOME
                </h1>
                <h1 className={`text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[11rem] 2xl:text-[12rem] font-extrabold inline-block mb-4 text-end ${scrolling ? 'animate-slide-right-reverse' : 'animate-slide-left'}`}>
                  TO
                </h1>
              </div>
              <div className="grid grid-cols-2">
                <h1 className={`w-full text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[11rem] 2xl:text-[12rem] font-extrabold inline-block mb-4 ${scrolling ? 'animate-slide-left-reverse' : 'animate-slide-right'}`}>
                  THE
                </h1>
                <h1 className={`w-full text-[2rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] 2xl:text-[12rem] font-extrabold inline-block mb-4 ${scrolling ? 'animate-slide-right-reverse' : 'animate-slide-left'}`}>
                  STYLEX
                </h1>
              </div>
            </div>
          </div>

          {/* Section with content below */}
          <div className="container mx-auto py-4">
            <div>
              <h1 className={`text-center  text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold `}>
              STYLEX
              </h1>
            </div>
            <div className='mb-20'>
              <h1 className={`  text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold  uppercase`}>
              story
              </h1>
            </div>
            <div className='flex justify-between 2xl:mx-52 mb-10'>
              <div className='shadow-xl shadow-gray-400 bg-[url(/src/img/3.jpg)] bg-cover bg-center h-[150px]  w-[350px]  md:h-[200px] md:w-[325px] lg:h-[250px] lg:w-[400px] xl:h-[350px] xl:w-[600px] mr-10'></div>
              <div className='text-[12px] sm:text-xs md:text-sm lg:text-base xl:text-xl h-[150px]  w-[350px]  md:h-[200px] md:w-[325px] lg:h-[250px] lg:w-[450px] xl:h-[350px] xl:w-[600px]'>
                STYLEX ไม่เพียงแต่เป็นร้านตัดผมที่ให้บริการออกแบบทรงผมเท่านั้น แต่ยังมาพร้อมกับระบบออนไลน์ที่ทันสมัยเพื่อความสะดวกสบายของลูกค้า ผ่านเว็บไซต์ของเรา คุณสามารถเลือกบริการที่ต้องการ เช่น การตัดผม ทำสี หรือการบำรุงเส้นผม พร้อมเลือกช่างที่คุณชื่นชอบได้ตามความสะดวก นอกจากนี้ยังสามารถดูคิวการจองและเวลาที่ว่าง เพื่อให้คุณวางแผนได้อย่างมีประสิทธิภาพและไม่ต้องรอนาน เราต้องการให้การใช้บริการที่ STYLEX เป็นเรื่องง่ายและสะดวกสบาย ตั้งแต่การจองออนไลน์ไปจนถึงการสัมผัสประสบการณ์การดูแลเส้นผมที่ดีที่สุดในทุกขั้นตอน
              </div>
            </div>
            <div className='flex justify-between 2xl:mx-52 mb-10'>
              <div className='text-[12px] sm:text-xs md:text-sm lg:text-base xl:text-xl h-[150px]  w-[350px]  md:h-[200px] md:w-[325px] lg:h-[250px] lg:w-[450px] xl:h-[350px] xl:w-[600px] mr-10'>
              STYLEX เกิดขึ้นจากความหลงใหลในศิลปะการสร้างสรรค์ทรงผมและการ
              ดูแลเส้นผมอย่างมืออาชีพ เราเริ่มต้นจากร้านเล็กๆ ด้วยความตั้งใจที่จะให้บริการที่เหนือกว่า พร้อมให้คำแนะนำส่วนตัวจากทีมช่างมืออาชีพ ที่พร้อมออกแบบทรงผมที่เหมาะสมและสอดคล้องกับบุคลิกของลูกค้าแต่ละคน เราเชื่อว่าเส้นผมที่ดีไม่เพียงแต่ทำให้คนสวยขึ้น แต่ยังเสริมสร้างความมั่นใจให้กับทุกคนในการเผชิญโลกภายนอก
              </div>
              <div className='shadow-xl shadow-gray-400 bg-[url(/src/img/4.jpg)] bg-cover bg-center h-[150px]  w-[350px]  md:h-[200px] md:w-[325px] lg:h-[250px] lg:w-[400px] xl:h-[350px] xl:w-[600px] '></div>
              
            </div>
            <div className='mb-10'>
              <h1 className={` text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold  uppercase`}>
                service
              </h1>
            </div>
            <div className='flex flex-col-4 items-center justify-between mx-52 h-[350px] md:mx-5'>
              <div className='bg-[#242529] h-[300px] w-[200px]  md:h-[200px] md:w-[150px] lg:h-[200px] lg:w-[150px] xl:h-[300px] xl:w-[200px] flex flex-col  items-center p-4 shadow-xl shadow-gray-400 self-start transition ease-out hover:-translate-y-6 hover:scale-100  duration-300'>
                {/* พื้นหลัง */}
                <div className='bg-[url(/src/img/salon.png)] bg-contain bg-no-repeat bg-center  h-[150px] w-[150px] md:h-[200px] md:w-[200px] lg:h-[250px] lg:w-[250px] xl:h-[150px] xl:w-[120px]'>
                </div>
                {/* ชื่อ service */}
                <div className='text-white text-[12px] sm:text-xs md:text-sm lg:text-base xl:text-xl mt-2 text-center'>
                  <h1 className='text-2xl sm:text-xs md:text-sm lg:text-base xl:text-2xl font-medium uppercase'>"hair cut"</h1>
                  <h1 className='text-sm sm:text-xs md:text-sm lg:text-sm xl:text-base font-bold'>ตัดผมสวย โดนใจ ด้วยช่างมืออาชีพที่ใส่ใจคุณ</h1>
                </div>
              </div>

              <div className='bg-[#242529] h-[300px] w-[200px] md:h-[200px] md:w-[150px] lg:h-[200px] lg:w-[150px] xl:h-[300px] xl:w-[200px] flex flex-col  items-center p-4 shadow-xl shadow-gray-400 transition ease-out hover:-translate-y-6 hover:scale-100  duration-300'>
                {/* พื้นหลัง */}
                <div className='bg-[url(/src/img/razor.png)] bg-contain bg-no-repeat bg-center  h-[150px] w-[150px] md:h-[200px] md:w-[200px] lg:h-[250px] lg:w-[250px] xl:h-[150px] xl:w-[120px]'>
                </div>
                {/* ชื่อ service */}
                <div className='text-white text-[12px] sm:text-xs md:text-sm lg:text-base xl:text-xl mt-2 text-center'>
                  <h1 className='text-2xl  sm:text-xs md:text-sm lg:text-base xl:text-2xl font-medium uppercase'>"shaving"</h1>
                  <h1 className='text-sm sm:text-xs md:text-sm lg:text-sm xl:text-base font-bold'>เปลี่ยนทุกสัมผัสให้เรียบเนียนในแบบที่คุณมั่นใจ</h1>
                </div>
              </div>

              <div className='bg-[#242529] h-[300px] w-[200px] md:h-[200px] md:w-[150px] lg:h-[200px] lg:w-[150px] xl:h-[300px] xl:w-[200px] flex flex-col  items-center p-4 shadow-xl shadow-gray-400 self-start transition ease-out hover:-translate-y-6 hover:scale-100  duration-300'>
                {/* พื้นหลัง */}
                <div className='bg-[url(/src/img/hair-clipper.png)] bg-contain bg-no-repeat bg-center  h-[150px] w-[150px] md:h-[200px] md:w-[200px] lg:h-[250px] lg:w-[250px] xl:h-[150px] xl:w-[120px]'>
                </div>
                {/* ชื่อ service */}
                <div className='text-white text-[12px] sm:text-xs md:text-sm lg:text-base xl:text-xl mt-2 text-center'>
                  <h1 className='text-2xl sm:text-xs md:text-sm lg:text-base xl:text-2xl font-medium uppercase'>"trimming"</h1>
                  <h1 className='text-sm sm:text-xs md:text-sm lg:text-sm xl:text-base font-bold'>เติมความเป๊ะในทุกเส้น สร้างลุคที่ลงตัว</h1>
                </div>
              </div>

              <div className='bg-[#242529] h-[300px] w-[200px] md:h-[200px] md:w-[150px] lg:h-[200px] lg:w-[150px] xl:h-[300px] xl:w-[200px] flex flex-col  items-center p-4 shadow-xl shadow-gray-400 transition ease-out hover:-translate-y-6 hover:scale-100  duration-300'>
                {/* พื้นหลัง */}
                <div className='bg-[url(/src/img/comb.png)] bg-contain bg-no-repeat bg-center  h-[150px] w-[150px] md:h-[200px] md:w-[200px] lg:h-[250px] lg:w-[250px] xl:h-[150px] xl:w-[120px]'>
                </div>
                {/* ชื่อ service */}
                <div className='text-white text-[12px] sm:text-xs md:text-sm lg:text-base xl:text-xl mt-2 text-center'>
                  <h1 className='text-2xl sm:text-xs md:text-sm lg:text-base xl:text-2xl font-medium uppercase'>"style&care"</h1>
                  <h1 className='text-sm sm:text-xs md:text-sm lg:text-sm xl:text-base font-bold'>สร้างสไตล์ที่ใช่ พร้อมดูแลเส้นผมให้สุขภาพดี</h1>
                </div>
              </div>

            </div>

            <div className="mb-10">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold uppercase">
                all gallery
              </h1>
            </div>
            <div className="w-full gallery-container mb-10">
              <div className="slider">
                <div className="slider-track">
                  {items.concat(items).map((item, index) => (
                    <div key={index} className="slider-item" style={{ backgroundImage: `url(${item})` }}></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full gallery-container">
              <div className="slider">
                <div className="slider-tracka ">
                  {itemsa.concat(itemsa).map((item1, index1) => ( // เพิ่มภาพซ้ำเพื่อให้มันเลื่อนต่อเนื่อง
                    <div key={index1} className="slider-item" style={{ backgroundImage: `url(${item1})` }}></div>
                  ))}
                </div>
              </div>
            </div>

            
          </div>

          {/* Dropdown menu */}
          <details className="dropdown">
            <summary className="btn m-1">open or close</summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </details>
        </div>
      </Layout>

      <style jsx>{`
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
            transform: translateX(-50%); /* เลื่อนให้หมดแล้วกลับมาเริ่มต้น */
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

        .animate-slide-bottom {
          animation: slideFromBottom 1s ease-out forwards;
        }

        .animate-slide-left-reverse {
          animation: slideLeftReverse 1s ease-out forwards;
        }

        .animate-slide-right-reverse {
          animation: slideRightReverse 1s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
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
          animation: slideInfinite 30s linear infinite alternate; /* การเลื่อนที่มีการย้อนกลับ */
        }
        
        .slider-tracka {
          display: flex;
          animation: slideLeftToRight 30s linear infinite alternate; /* ตั้งเวลาของการเลื่อนให้เป็น 20 วินาทีและเลื่อนไปขวา */
        }

        .slider-item {
          min-width: 300px;
          margin-right: 16px;
          flex-shrink: 0;
          height: 200px;
          border-radius: 0.5rem;
          background-color: #ddd;
          background-size: cover; /* ทำให้รูปภาพครอบคลุมพื้นที่ของกล่อง */
          background-position: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        
      `}</style>
    </div>
  );
}

export default Home;
