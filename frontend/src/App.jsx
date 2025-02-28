import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import { useAuth } from "./contexts/AuthContext";

function App() {
  const [message, setMessage] = useState("");
  const { logout } = useAuth();
  const handleLogout = () => {
    logout(); // เรียกใช้ฟังก์ชัน logout เมื่อคลิกปุ่ม
  };
  useEffect(() => {
    fetch(`${apiUrl}/example/`)
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <>
      <div className="App">
        <h1>React + Django</h1>
        <p>Message from Django API: {message}</p>
        <div className="min-h-screen bg-blue-500 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">
            Hello, Tailwind CSS!
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default App;
