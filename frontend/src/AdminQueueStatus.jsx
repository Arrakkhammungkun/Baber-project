import { useState, useEffect } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
const URLSOCKET = import.meta.env.VITE_API_URLSOCKET;
const AdminQueueStatus = () => {
  const [queue, setQueue] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket(`${URLSOCKET}/ws/queue/`);
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("Connected to WebSocket");
      newSocket.send(JSON.stringify({ action: "fetch_queue" })); // ขอข้อมูลคิว
    };

    newSocket.onmessage = (event) => {
      
      try {
        const data = JSON.parse(event.data);

        if (data.delete) {
          // ถ้ามีคำสั่งลบคิว
          setQueue((prevQueue) =>
            prevQueue.filter((q) => q.id !== data.delete)
          );
        } else if (Array.isArray(data)) {
          setQueue(data);
        } else if (data && typeof data === "object") {
          setQueue((prevQueue) => {
            const updatedQueue = prevQueue.map((q) =>
              q.id === data.id ? data : q
            );
            const exists = prevQueue.some((q) => q.id === data.id);
            return exists ? updatedQueue : [...prevQueue, data];
          });
        } else {
          console.error("Unexpected WebSocket data:", data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    newSocket.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
      setTimeout(() => {
        setSocket(null); // เคลียร์ state
      }, 3000); // รอ 3 วิ แล้วให้ useEffect รันใหม่
    };

    return () => {
      newSocket.close();
    };
  }, []);

  const handleConfirmQueue = (id) => {
    fetch(`${apiUrl}/bookings/${id}/confirm/`, { method: "POST" })
      .then((response) => response.json())
      .then(() => {
        
        // อัปเดตสถานะคิวเป็น "กำลังดำเนินการ"
        setQueue((prevQueue) =>
          prevQueue.map((q) =>
            q.id === id ? { ...q, status: "In_progress" } : q
          )
        );
      });
  };
  const handleCompleteQueue = (id) => {
    fetch(`${apiUrl}/bookings/${id}/complete/`, { method: "POST" })
      .then((response) => response.json())
      .then(() => {
        
        // ลบคิวออกจาก state และย้ายไปที่ประวัติการให้บริการ
        setQueue((prevQueue) => prevQueue.filter((q) => q.id !== id));
      });
  };

  const handleDeleteQueue = (id) => {
    fetch(`${apiUrl}/bookings/${id}/delete/`, { method: "DELETE" })
      .then((response) => response.json())
      .then(() => {
        

        setQueue((prevQueue) => prevQueue.filter((q) => q.id !== id));

        // ส่งคำขอให้ WebSocket อัปเดตข้อมูลคิว
        if (socket) {
          socket.send(JSON.stringify({ action: "fetch_queue" })); // ดึงคิวใหม่หลังจากลบ
        }
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">สถานะคิว (Admin)</h2>

      <ul>
        {Array.isArray(queue) && queue.length > 0 ? (
          queue.map((q, index) => (
            <li key={q.id} className="mb-2 flex justify-between items-center">
              <div>
                <h1>{index + 1}</h1>
                <p>ลูกค้า: {q.customer}</p>
                <p>สถานะ: {q.status}</p>
                <p>บริการ: {q.service}</p>
                <p>เริ่ม: {q.start_time}</p>
                <p>เสร็จ: {q.end_time}</p>
              </div>

              {/* ถ้าคิวอยู่ในสถานะ "รอคิว" ให้แสดงปุ่ม "ยืนยันคิว" */}
              {q.status === "pending" && (
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => handleConfirmQueue(q.id)}
                >
                  ยืนยันคิว
                </button>
              )}

              {/* ถ้าคิวอยู่ในสถานะ "กำลังดำเนินการ" ให้แสดงปุ่ม "เสร็จสิ้น" */}
              {q.status === "In_progress" && (
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => handleCompleteQueue(q.id)}
                >
                  เสร็จสิ้น
                </button>
              )}
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => handleDeleteQueue(q.id)}
              >
                ลบ
              </button>
            </li>
          ))
        ) : (
          <p>ไม่พบข้อมูลคิว</p>
        )}
      </ul>
    </div>
  );
};

export default AdminQueueStatus;
