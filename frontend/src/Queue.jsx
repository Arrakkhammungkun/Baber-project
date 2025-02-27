import { useState, useEffect } from "react";

const URLSOCKET = import.meta.env.VITE_API_URLSOCKET;
const apiUrl = import.meta.env.VITE_API_URL;
import Layout from "./components/Layout";

const Queue = () => {
  const [setQueue] = useState([]);
  const [position, setPosition] = useState(null);
  

  useEffect(() => {
    const newSocket = new WebSocket(`${URLSOCKET}/ws/queue/`);

    newSocket.onopen = () => {
      console.log("Connected to WebSocket");
      newSocket.send(JSON.stringify({ action: "fetch_queue" }));
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          setQueue(data);
          const userQueue = data.find((q) => q.isCurrentUser);
          setPosition(userQueue ? userQueue.position : null);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
    };

    return () => {
      newSocket.close();
    };
  }, [setQueue]);

  return (
    <Layout>
      <div className="container mx-auto mt-24">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Queue</h1>
          <div className="flex justify-between">
            <h2 className="text-xl font-bold text-gray-800 border-b-4 border-black w-1/2 mr-2">
              Your booking queue
            </h2>
            <h2 className="text-xl font-bold text-gray-800 border-b-4 border-black w-1/2">
              Other booking queues
            </h2>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-4">
          {/* รายการที่จอง */}
          <div className="bg-[#242529] text-white p-4 rounded-lg h-auto overflow-auto">
            <div className="flex justify-between border-b-2 mb-4 pb-2">
              <h3 className="text-lg font-bold">รายการที่จอง</h3>
            </div>
            {/* ข้อมูลคิว */}
            <div className="flex items-center text-white mb-2">
                    
              <div className="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                <img src="/src/img/14.jpg" alt="Barber" className="w-full h-full object-cover object-center" />
              </div>
  
              <div className="flex flex-col flex-grow px-4">
                <div className="">
                  <p className="font-bold">บริการ : <span className="">ตัดผม</span></p>
                  <p className="font-bold">รายละเอียด : <span className="">ตัดผมสไตล์ยุโรป</span></p>
                  <p className="font-bold">เวลาบริการ : <span className="">30 นาที</span></p>
                </div>
                        
              </div>

                    
            </div>

            <div className="flex items-center text-white mb-2">
                    
              <div className="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                <img src="/src/img/14.jpg" alt="Barber" className="w-full h-full object-cover object-center" />
              </div>
  
              <div className="flex flex-col flex-grow px-4">
                <div className="">
                  <p className="font-bold">ช่าง : <span className="">นาย ก นามสกุล</span></p>
                  <p className="font-bold">ชื่อเล่น : <span className="">ทัช</span></p>
                  <p className="font-bold">เพศ : <span className="">ชาย</span></p>
                </div>     
              </div>    
            </div>

            <div className="flex justify-between border-b-2 mb-4 pb-2">
              <h3 className="text-lg font-bold">รายการที่จอง</h3>
            </div>
            
            <div className="flex flex-col flex-grow px-4">
              <div className="flex justify-between">
                <p className="font-bold">วันที่</p>
                <p className="font-bold"> 21 กมภาพันธ 2025</p>
              </div>
              <div className="flex justify-between mt-1">
                <p className="font-bold">เวลา</p>
                <p className="font-bold">13.00 น.</p>
              </div>
              <div className="flex justify-between mt-1">
                <p className="font-bold">ค่าบริการ</p>
                <p className="font-bold">500 บาท</p>
              </div>
              <div className="flex justify-between mt-1">
              <p className="font-bold">Status : <span className="text-[#FBBC05]">Pending</span></p>
              <button className="font-semibold text-white capitalize bg-[#CC2F22] py-1 px-2 rounded-lg hover:bg-red-700  duration-300 ease-in-out">Cancel</button>
              </div>
            </div>
          </div>

          {/* ลำดับคิว */}
            <div className="flex flex-col gap-4 text-white">
                <div className="flex justify-between bg-[#242529] p-4 rounded-lg">
                    <div className="flex items-center">
                        <h3 className="text-3xl font-bold">ลำดับคิวของคุณอยู่ที่</h3>
                    </div>
                    <div className="bg-[#545454] w-14 h-14 flex items-center justify-center text-white rounded-lg">
                        <span className="text-3xl">{position !== null ? position : "-"}</span>
                    </div>
                </div>

                <div className="flex items-center bg-[#242529] px-3 py-1 rounded-lg text-white w-full">
                    {/* รูปภาพ */}
                    <div className="w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden">
                        <img src="/src/img/14.jpg" alt="Barber" className="w-full h-full object-cover object-center" />
                    </div>

                    {/* ข้อมูลคิว */}
                    <div className="flex flex-col flex-grow px-4">
                        <div className="flex justify-between">
                        <p className="font-bold">Barber : <span className="text-gray-300">ARCHIE WILLIAMS</span></p>
                        <p className="font-bold">Time : <span className="text-gray-300">10 : 30 AM.</span></p>
                        </div>
                        <div className="flex justify-between mt-1">
                        <p className="font-bold">Service : <span className="text-gray-300">Men&apos;s haircut</span></p>
                        <p className="font-bold">Status : <span className="text-green-500">In progress</span></p>
                        </div>
                    </div>

                    {/* ลำดับคิว */}
                    <div className="bg-green-500 w-20 h-20 flex items-center justify-center text-white rounded-lg text-3xl font-bold ml-10">
                        1
                    </div>
                </div>

            </div>
        </div>
      </div>
    </Layout>
  );
};

export default Queue;
