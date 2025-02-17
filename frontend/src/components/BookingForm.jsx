import { useState, useEffect } from "react";
import axios from "axios";
const apiUrl =import.meta.env.VITE_API_URL;
// import { useAuth } from '../contexts/AuthContext';
const BookingForm = () => {
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  // const { user, token, logout } = useAuth();

  useEffect(() => {
    axios.get(`${apiUrl}/services/`).then((res) => setServices(res.data));
    axios.get(`${apiUrl}/employee/`).then((res) => setEmployees(res.data));
  }, []);
  const handleBooking = async () => {
    console.log(selectedEmployee)
    const bookingData = {
      customer: "67925c7a28a366b5a19b5998", // เปลี่ยนเป็น user ที่ล็อกอิน
      service: selectedService,
      employee: selectedEmployee,
      date,
      start_time: `${date}T${time}:00Z`, // แปลงเป็น ISO format
    };
    console.log(bookingData)
    try {
      await axios.post(`${apiUrl}/bookings/`, bookingData);
      alert("จองสำเร็จ!");
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">จองคิวตัดผม</h2>

      <label>เลือกบริการ</label>
      <select onChange={(e) => setSelectedService(e.target.value)}>
        <option value="">-- เลือก --</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} ({s.duration} นาที)
          </option>
        ))}
      </select>

      <label>เลือกช่าง</label>
      <select onChange={(e) => setSelectedEmployee(e.target.value)}>
        <option value="">-- เลือก --</option>
        {employees.map((e) => (
          <option key={e.id} value={e.id}>
            {e.first_name} {e.last_name}
          </option>
        ))}
      </select>

      <label>เลือกวัน</label>
      <input type="date" onChange={(e) => setDate(e.target.value)} />

      <label>เลือกเวลา</label>
      <input type="time" onChange={(e) => setTime(e.target.value)} />

      <button onClick={handleBooking} className="bg-blue-500 text-white p-2 mt-4">
        จองคิว
      </button>
    </div>
  );
};

export default BookingForm;
