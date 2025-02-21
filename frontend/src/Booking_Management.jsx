import { useState, useEffect } from "react";
const URLSOCKET = import.meta.env.VITE_API_URLSOCKET;
const apiUrl =import.meta.env.VITE_API_URL;
import Layout from './components/Layout';



const Booking_Management = () => {
  const [queue, setQueue] = useState([]);
  const [socket, setSocket] = useState(null);

  
  useEffect(() => {
    const newSocket = new WebSocket(`${URLSOCKET}/ws/queue/`);
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("Connected to WebSocket");
      newSocket.send(JSON.stringify({ action: "fetch_queue" }));
    };

    newSocket.onmessage = (event) => {
      console.log("WebSocket received:", event.data);
      try {
        const data = JSON.parse(event.data);
        console.log("Parsed data:", data);
        if (data.delete) {
          setQueue((prevQueue) => prevQueue.filter(q => q.id !== data.delete));
        } else if (Array.isArray(data)) {
          setQueue(data);  
        } else if (data && typeof data === "object") {
          setQueue((prevQueue) => {
            const updatedQueue = prevQueue.map((q) =>
              q.id === data.id ? { ...q, ...data } : q
            );
            return prevQueue.some((q) => q.id === data.id) ? updatedQueue : [...prevQueue, data];
          });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
      setTimeout(() => {
        setSocket(null); // เคลียร์ state
      }, 3000);
    };

    return () => {
      newSocket.close();
    };
  }, []);


  const handleConfirmQueue = (id) => {
    fetch(`${apiUrl}/bookings/${id}/confirm/`, { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        console.log("Queue confirmed:", data);
        setQueue((prevQueue) =>
          prevQueue.map((q) =>
            q.id === id ? { ...q, status: "In_progress" } : q
          )
        );
        
        if (socket) {
          socket.send(JSON.stringify({ action: "fetch_queue" })); // ขอข้อมูลคิวใหม่
        }
      });
  };
  const handleCompleteQueue = (id) => {
    fetch(`${apiUrl}/bookings/${id}/complete/`, { method: "POST" })
      .then((response) => response.json())
      .then((data) => {
        console.log("Queue completed:", data);
        // ลบคิวออกจาก state และย้ายไปที่ประวัติการให้บริการ
        setQueue((prevQueue) => prevQueue.filter(q => q.id !== id));


        if (socket) {
          socket.send(JSON.stringify({ action: "fetch_queue" })); // ดึงคิวใหม่หลังจากเสร็จสิ้น
        }
      });
  };
  
  const handleDeleteQueue = (id) => {
    // เริ่มต้นด้วยการลบคิวจาก state ก่อนที่จะส่งคำขอลบ
    setQueue((prevQueue) => prevQueue.filter((q) => q.id !== id));
  
    // ลบคิวจาก backend
    fetch(`${apiUrl}/bookings/${id}/delete/`, { method: "DELETE" })
      .then((response) => response.json())
      .then((data) => {
        console.log("Queue deleted:", data);
  
        // ดึงข้อมูลคิวใหม่หลังจากลบ
        fetch(`${apiUrl}/bookings/queue/`)
          .then((res) => res.json())
          .then((newQueue) => {
            setQueue(newQueue); // อัปเดตข้อมูลคิวใหม่
          });
  
        // ส่งคำขอให้ WebSocket อัปเดตข้อมูลคิว
        if (socket) {
          socket.send(JSON.stringify({ action: "fetch_queue" })); // ดึงคิวใหม่หลังจากลบ
        }
      })
      .catch((error) => {
        console.error("Error deleting queue:", error);
        // ถ้ามีข้อผิดพลาดในการลบ ให้คืนค่าข้อมูลคิวเดิม
        setQueue((prevQueue) => [...prevQueue]); // คืนค่าข้อมูลคิวเดิม
      });
  };
  
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // จะได้วันที่และเวลาในรูปแบบที่เหมาะสมกับภาษาในระบบ
  };
  return (
    <div >
        <Layout>

      <div className='container mt-24 mx-auto '>

       
        <header className="mb-2 text-start ">
          <h1 className="text-2xl font-bold text-gray-800 p-2 ml-20">BOOKING MANAGEMENT</h1>
          <h1 className="text-xl font-bold text-gray-800 p-2 ">Queue</h1>
          <hr className='bg-black border-black text-black border-2 px-2' />
        </header>
        <div className="max-w-full mx-auto bg-white shadow-md rounded-lg p-4">
          
              <div className="space-y-4">
  {Array.isArray(queue) && queue.length > 0 ? (
    queue.map((q) => (
      <div
        key={`queue-${q.id}-${q.status}`}
        className="flex items-start bg-black w-full p-4 mb-2 rounded-l-full rounded-br-[1200rem] shadow-sm"
      >
        {/* รูปภาพผู้ใช้ */}
        <div className="flex items-center">
          <img
            src="/src/img/14.jpg"
            alt="User"
            className="rounded-full w-32 h-32 object-cover"
          />
        </div>

        {/* รายละเอียดลูกค้า */}
        <div className="flex flex-col text-white font-medium px-4">
          <p>
            คิวที่: {q.queue_number !== undefined && q.queue_number !== null 
              ? q.queue_number 
              : (q.queue_position || "ไม่ระบุ")}
          </p>



          <p>
            ลูกค้า: {typeof q.customer === "string" 
              ? q.customer 
              : `${q.customer.first_name} ${q.customer.last_name}`}
          </p>

          <p>
            พนักงาน: {typeof q.employee === "string" 
              ? q.employee 
              : `${q.employee.first_name} ${q.employee.last_name}`}
          </p>
          <p>
            บริการ: {typeof q.service === "string" 
              ? q.service 
              : `${q.service.name}`}
          </p>

          <p>
            เวลาเริ่ม: {typeof q.end_time === "string" 
              ? formatDate(q.start_time) 
              : `${formatDate(q.start_time) } `}
          </p>
          <p>
            เวลาเสร็จ: {typeof q.end_time === "string" 
              ? formatDate(q.end_time) 
              : `${formatDate(q.end_time)}`}
          </p>

          
          <p className="">สถานะ : {q.status}</p>
        </div>

        {/* ปุ่ม และ สถานะ */}
        <div className="flex space-x-3 ml-auto pt-0 items-start justify-end">
          {/* ปุ่มยืนยันคิว */}
          {q.status === "pending" && (
            <button
              className="w-full md:w-32 py-4 bg-[#00BA9A] text-white text-sm rounded-md hover:bg-[#00A085]"
              onClick={() => handleConfirmQueue(q.id)}
            >
              ยืนยันคิว
            </button>
          )}

          {/* ปุ่มเสร็จสิ้น */}
          {q.status === "In_progress" && (
            <button
              className="w-full md:w-32 py-4 bg-[#00BA9A] text-white text-sm rounded-md hover:bg-[#00A085]"
              onClick={() => handleCompleteQueue(q.id)}
            >
              เสร็จสิ้น
            </button>
          )}

          {/* ปุ่มลบ */}
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
      <div className='my-[20rem]'>

      </div>
      </Layout>
    </div>
  );
};

export default Booking_Management;
