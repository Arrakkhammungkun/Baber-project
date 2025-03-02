import { useState, useEffect } from "react";
const URLSOCKET = import.meta.env.VITE_API_URLSOCKET;
const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl_img = import.meta.env.VITE_API_IMG;
import LayoutAdmin from './components/LayoutAdmin';

const Booking_Management = () => {
  const [queue, setQueue] = useState([]);
  const [socket, setSocket] = useState(null);
  console.log(URLSOCKET)
  useEffect(() => {
    const newSocket = new WebSocket(`${URLSOCKET}/ws/queue/`);
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("Connected to WebSocket");
      newSocket.send(JSON.stringify({ action: "fetch_queue" }));
    };

    newSocket.onmessage = (event) => {
      
      try {
        const data = JSON.parse(event.data);
        
        if (data.delete) {
          setQueue((prevQueue) =>
            prevQueue.filter((q) => q.id !== data.delete)
          );
        } else if (Array.isArray(data)) {
          setQueue(data); // อัพเดทข้อมูลคิวทั้งหมดจาก WebSocket
        } else if (data && typeof data === "object") {
          setQueue((prevQueue) => {
            const updatedQueue = prevQueue.map((q) =>
              q.id === data.id ? { ...q, ...data } : q
            );
            return prevQueue.some((q) => q.id === data.id)
              ? updatedQueue
              : [...prevQueue, data];
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
      setTimeout(() => {
        setSocket(null);
      }, 3000);
    };

    return () => {
      newSocket.close();
    };
  }, []);

  const handleConfirmQueue = (id) => {
    fetch(`${apiUrl}/bookings/${id}/confirm/`, { method: "POST" })
      .then((response) => response.json())
      .then(() => {
        if (socket) {
          socket.send(JSON.stringify({ action: "fetch_queue" }));
        }
      });
  };

  const handleCompleteQueue = (id) => {
    fetch(`${apiUrl}/bookings/${id}/complete/`, { method: "POST" })
      .then((response) => response.json())
      .then(() => {
        if (socket) {
          socket.send(JSON.stringify({ action: "fetch_queue" }));
        }
      });
  };

  const handleDeleteQueue = (id) => {
    fetch(`${apiUrl}/bookings/${id}/delete/`, { method: "DELETE" })
      .then((response) => response.json())
      .then(() => {
        if (socket) {
          socket.send(JSON.stringify({ action: "fetch_queue" }));
        }
      })
      .catch((error) => {
        console.error("Error deleting queue:", error);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(); // คืนค่าด้วยแค่เวลา
  };

  // เพิ่มการเรียงลำดับ queue
  const sortedQueue = [...queue].sort((a, b) => {
    // เรียง In_progress มาก่อน
    if (a.status === "In_progress" && b.status !== "In_progress") return -1;
    if (a.status !== "In_progress" && b.status === "In_progress") return 1;
    
    // ถ้าสถานะเหมือนกัน เรียงตาม queue_number + 1
    const queueA = (a.queue_number !== undefined && a.queue_number !== null ? a.queue_number + 1 : Infinity);
    const queueB = (b.queue_number !== undefined && b.queue_number !== null ? b.queue_number + 1 : Infinity);
    return queueA - queueB;
  });

  return (
    <div>
      <LayoutAdmin>
        <div className="container mt-24 mx-auto">
          <header className="mb-2 text-start">
            <h1 className="text-2xl font-bold text-gray-800 p-2 ml-20">
              BOOKING MANAGEMENT
            </h1>
            <h1 className="text-xl font-bold text-gray-800 p-2">Queue</h1>
            <hr className="bg-black border-black text-black border-2 px-2" />
          </header>
          <div className="max-w-full mx-auto bg-white shadow-md rounded-lg p-4">
            <div className="space-y-4">
              {Array.isArray(sortedQueue) && sortedQueue.length > 0 ? (
                sortedQueue.map((q) => (
                  <div
                    key={`queue-${q.id}-${q.status}`}
                    className="flex items-start bg-black w-full p-4 mb-2 rounded-l-full rounded-br-[1200rem] shadow-sm"
                  >
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center">
                        {q.customer && q.customer.profile ? (
                          <img
                            src={`${apiUrl_img}${q.customer.profile}`}
                            alt="Profile"
                            className="rounded-full w-32 h-32 object-cover"
                          />
                        ) : (
                          <div className="rounded-full w-auto h-auto object-cover bg-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="rounded-full w-32 h-32 object-cover mt-1"
                              viewBox="0 0 448 512"
                              fill="currentColor"
                            >
                              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className={
                        q.status === "In_progress" 
                          ? "text-green-500 text-center text-xs mt-1" 
                          : (q.status === "pending" 
                              ? (q.queue_number + 1 === 1 
                                  ? "text-orange-500 text-center text-xs mt-1" // สีส้มถ้าเป็นคิวแรก
                                  : "text-yellow-500 text-center text-xs mt-1"  // สีเหลืองถ้าไม่ใช่คิวแรก
                                )
                              : "text-green-500 text-center text-xs mt-1" // สีเขียวสำหรับสถานะอื่นๆ
                            )
                      }>
                        {q.status === "pending" 
                          ? (q.queue_number + 1 === 1 ? "คิวถัดไป..." : "กำลังรอ...")
                          : q.status === "In_progress" 
                            ? "กำลังให้บริการ..." 
                            : q.status
                        }
                      </p>
                    </div>
                    <div className="flex flex-col text-white font-medium px-4">
                      <p>
                        คิวที่: {q.queue_number !== undefined && q.queue_number !== null 
                          ? q.queue_number + 1
                          : (q.queue_position || "ไม่ระบุ")}
                      </p>
                      <p>
                        ลูกค้า:{" "}
                        {typeof q.customer === "string"
                          ? q.customer
                          : `${q.customer.first_name} ${q.customer.last_name}`}
                      </p>
                      <p>
                        พนักงาน:{" "}
                        {typeof q.employee === "string"
                          ? q.employee
                          : `${q.employee.first_name} ${q.employee.last_name}`}
                      </p>
                      <p>
                        บริการ:{" "}
                        {typeof q.service === "string"
                          ? q.service
                          : `${q.service.name}`}
                      </p>
                      <p>
                        เวลาเริ่ม: {formatTime(q.start_time)} น.
                      </p>
                      <p>
                        เวลาเสร็จ: {formatTime(q.end_time)} น.
                      </p>
                    </div>
                    <div className="flex space-x-3 ml-auto pt-0 items-start justify-end">
                      {q.status === "pending" && q.queue_number === 0 && (
                        <button
                          className="w-full md:w-32 py-4 bg-[#dfdc5f] text-white text-sm rounded-md hover:bg-[#cfcd5b]"
                          onClick={() => handleConfirmQueue(q.id)}
                        >
                          เข้ารับบริการ
                        </button>
                      )}
                      {q.status === "In_progress" && (
                        <button
                          className="w-full md:w-32 py-4 bg-[#00BA9A] text-white text-sm rounded-md hover:bg-[#00A085]"
                          onClick={() => handleCompleteQueue(q.id)}
                        >
                          เสร็จสิ้น
                        </button>
                      )}
                      <button
                        className="w-full md:w-32 py-4 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                        onClick={() => handleDeleteQueue(q.id)}
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white text-center">ไม่พบข้อมูลคิว</p>
              )}
            </div>
          </div>
        </div>
        <div className="my-[20rem]"></div>
      </LayoutAdmin>
    </div>
  );
};

export default Booking_Management;
