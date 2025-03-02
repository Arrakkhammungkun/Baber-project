import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import axios from "axios";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import Loader from "./components/Loader";
const apiUrl = import.meta.env.VITE_API_URL;
import Swal from "sweetalert2";
import utc from "dayjs/plugin/utc";
import { useAuth } from "./contexts/AuthContext";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/th";
import { useNavigate } from "react-router-dom";

const Bookingbarber = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.locale("th");

  const { token, user } = useAuth();
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTimeText, setSelectedTimeText] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [Service, setService] = useState([]);

  useEffect(() => {
    if (showModal) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [showModal]);

  const handleBooking_modal = async () => {
    if (!selectedEmployeeId || !selectedTimeText) {
      Swal.fire({
        icon: "error",
        title: "กรุณาเลือกวันและเวลา.",
        confirmButtonText: "ตกลง",
      });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setShowModal(true);
      setIsLoading(false);
    }, 500);
  };

  const cancelBooking = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (selectedDate && selectedEmployeeId) {
      axios
        .get(
          `${apiUrl}/bookings/${selectedEmployeeId.id}/${selectedDate.format(
            "YYYY-MM-DD"
          )}/`
        )
        .then((response) => {
          setBookedTimes(response.data.booked_times);
          const filteredAvailableTimes = response.data.available_times.filter(
            (time) => !response.data.booked_times.includes(time)
          );
          setAvailableTimes(filteredAvailableTimes);
        })
        .catch((error) => console.error("Error fetching bookings:", error));
    }
  }, [selectedDate, selectedEmployeeId]);

  const today = dayjs();

  const handleSelectEmployee = (id) => {
    if (selectedEmployeeId === id) {
      setSelectedEmployeeId(null);
    } else {
      setSelectedEmployeeId(id);
    }
  };

  const isPastTime = (time, date) => {
    const selectedDateTime = dayjs(`${date} ${time}`, "YYYY-MM-DD h:mm A");
    const currentDateTime = dayjs();
    return selectedDateTime.isBefore(currentDateTime, "minute");
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const isBooked = (time) => bookedTimes.includes(time);

  const handleTimeSelect = (index, time) => {
    if (
      !isPastTime(time, selectedDate.format("YYYY-MM-DD")) &&
      !isBooked(time)
    ) {
      setSelectedTime(index);
      setSelectedTimeText(`${time}`);
    }
  };

  const generateCalendar = () => {
    const startOfMonth = selectedDate.startOf("month").day();
    const daysInMonth = selectedDate.daysInMonth();
    let daysArray = Array.from({ length: startOfMonth }, () => null);
    daysArray = daysArray.concat(
      [...Array(daysInMonth).keys()].map((i) => i + 1)
    );
    return daysArray;
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${apiUrl}/employee/`)
      .then((response) => {
        const activeEmployees = response.data.filter(
          (employee) => employee.status === "Active"
        );
        setEmployees(activeEmployees);
      })
      .catch((error) => console.error("Error fetching employees:", error))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${apiUrl}/services/${serviceId}/`)
      .then((response) => setService(response.data))
      .catch((error) => console.error("Error fetching service:", error))
      .finally(() => setIsLoading(false));
  }, [serviceId]);

  const convertDateToThaiFormat = (dateString) => {
    const date = dayjs(dateString, "DD MMMM YYYY", "en");
    return date.isValid() ? date.format("DD/MM/YYYY") : "รูปแบบวันที่ไม่ถูกต้อง";
  };

  const selectedTimeFormatted = dayjs(
    `${selectedDate.format("YYYY-MM-DD")} ${selectedTimeText
      .replace("Selected Time: ", "")
      .trim()}`,
    "YYYY-MM-DD h:mm A"
  )
    .utc()
    .local()
    .format("YYYY-MM-DDTHH:mm:ss[Z]");

  const convertToThaiTime = (time) => {
    const [hour, minute, period] = time.match(/(\d+):(\d+) (\w+)/).slice(1);
    let thaiHour = parseInt(hour, 10);
    if (period === "PM" && thaiHour !== 12) {
      thaiHour += 12;
    } else if (period === "AM" && thaiHour === 12) {
      thaiHour = 0;
    }
    return `${thaiHour}:${minute} น.`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return "ยังไม่เลือก";
    let cleanTime = timeString.replace("Selected Time", "").trim();
    let match = cleanTime.match(/(\d{1,2}):(\d{2})\s?(AM|PM)/);
    if (!match) return "รูปแบบเวลาไม่ถูกต้อง";
    let [, hours, minutes, period] = match;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    if (period === "PM" && hours !== 12) {
      hours += 12;
    }
    if (period === "AM" && hours === 12) {
      hours = 0;
    }
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} น`;
  };

  const handleBooking = async () => {
    setIsLoading(true);
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "กรุณา login",
        confirmButtonText: "ตกลง",
      });
      navigate("/login");
      setIsLoading(false);
      return;
    }
    if (!selectedEmployeeId || !selectedTimeText) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกพนักงานและเวลา",
        confirmButtonText: "ตกลง",
      });
      setIsLoading(false);
      return;
    }
    if (
      isPastTime(
        selectedTimeText.replace("Selected Time: ", ""),
        selectedDate.format("YYYY-MM-DD")
      )
    ) {
      Swal.fire({
        icon: "error",
        title: "Cannot book a time in the past.",
        confirmButtonText: "ตกลง",
      });
      setIsLoading(false);
      return;
    }
    if (isBooked(selectedTimeText.replace("Selected Time: ", ""))) {
      Swal.fire({
        icon: "error",
        title: "เวลานี้ถูกจองไปแล้ว",
        confirmButtonText: "ตกลง",
      });
      setIsLoading(false);
      return;
    }
    const bookingData = {
      customer: user.user_id,
      service: serviceId,
      employee: selectedEmployeeId.id,
      date: selectedDate.format("YYYY-MM-DD"),
      start_time: selectedTimeFormatted,
    };
    try {
      const response = await axios.post(`${apiUrl}/bookings/`, bookingData);
      Swal.fire({
        icon: "success",
        title: "Booking successful!",
        confirmButtonText: "ตกลง",
      });
      setBookedTimes((prevBookedTimes) => [
        ...prevBookedTimes,
        selectedTimeText.replace("Selected Time: ", ""),
      ]);
      const filteredAvailableTimes = availableTimes.filter(
        (time) => time !== selectedTimeText.replace("Selected Time: ", "")
      );
      setAvailableTimes(filteredAvailableTimes);
      setIsLoading(false);
      setShowModal(false);
    } catch (error) {
      setShowModal(false);
      console.error("Error making booking:", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "Failed to make booking",
        text: error.response?.data?.message || "Please try again.",
        confirmButtonText: "ตกลง",
      });
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Layout>
        {isLoading && <Loader />}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex items-center justify-center px-2 sm:px-4">
            <div className="bg-white text-black p-4 sm:p-6 rounded-xl w-full max-w-[90vw] sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center">
                สรุปข้อมูลการจอง
              </h2>
              <hr />
              <p className="text-base sm:text-lg font-bold mt-2">รายการที่เลือก</p>
              <div className="text-sm sm:text-base text-black mt-1 p-2">
                {/* Section บริการ */}
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-cover bg-center rounded-lg flex-shrink-0"
                    style={{ backgroundImage: `url(${Service.image_url})` }}
                  ></div>
                  <div>
                    <p>
                      <strong>บริการ:</strong> {Service ? `${Service.name}` : "ยังไม่เลือก"}
                    </p>
                    <p className="mt-1">
                      <strong>รายละเอียด:</strong>{" "}
                      {Service ? `${Service.description}` : "ยังไม่เลือก"}
                    </p>
                  </div>
                </div>

                {/* Section พนักงาน */}
                <div className="flex flex-col sm:flex-row items-start gap-4 mt-4">
                  <div
                    className="w-20 h-20 sm:w-24 sm:h-24 bg-cover bg-center rounded-lg flex-shrink-0"
                    style={{
                      backgroundImage: `url(${selectedEmployeeId?.employee_image_url})`,
                    }}
                  ></div>
                  <div>
                    <p>
                      <strong>ชื่อพนักงาน:</strong>{" "}
                      {selectedEmployeeId
                        ? `${selectedEmployeeId.first_name} ${selectedEmployeeId.last_name}`
                        : "ยังไม่เลือก"}
                    </p>
                    <p>
                      <strong>ชื่อเล่น:</strong>{" "}
                      {selectedEmployeeId ? `${selectedEmployeeId.nickname}` : "ยังไม่เลือก"}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm sm:text-base mt-1">
                      <p>
                        <strong>เพศ:</strong>{" "}
                        {selectedEmployeeId ? `${selectedEmployeeId.gender}` : "ยังไม่เลือก"}
                      </p>
                      <p>
                        <strong>อายุ:</strong>{" "}
                        {selectedEmployeeId
                          ? `${calculateAge(selectedEmployeeId.dob)} ปี`
                          : "ยังไม่เลือก"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section วัน-เวลา */}
                <p className="text-base sm:text-lg font-bold mt-4">วันที่จอง</p>
                <hr />
                <div className="mt-2 space-y-2 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <strong>วันที่</strong>
                    <span>{selectedDate.format("DD MMMM YYYY")}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>เวลา</strong>
                    <span>{formatTime(selectedTimeText)}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>เวลาบริการ:</strong>
                    <span>{Service ? `${Service.duration} นาที` : "ยังไม่เลือก"}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>ค่าบริการ:</strong>
                    <span>{Service ? `${Service.price} บาท` : "ยังไม่เลือก"}</span>
                  </div>
                </div>

                <p className="text-center text-xs sm:text-sm mt-4">
                  **หมายเหตุ** โปรดมาตรงเวลา
                </p>
              </div>

              {/* ปุ่ม */}
              <div className="mt-4 flex flex-col sm:flex-row justify-between gap-2">
                <button
                  onClick={cancelBooking}
                  className="bg-red-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-red-700 w-full sm:w-auto"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleBooking}
                  className="bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-green-600 w-full sm:w-auto"
                >
                  ยืนยันการจอง
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="container mt-16 sm:mt-20 md:mt-24 mx-auto px-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 p-2 uppercase text-center sm:text-left">
            Booking
          </h1>
          <div className="flex flex-col lg:flex-row justify-between w-full gap-6">
            {/* Barber Section */}
            <div className="w-full lg:w-2/3 p-2">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 p-2 capitalize text-center sm:text-left">
                Barber
              </h1>
              <hr className="bg-black border-black border mb-5 mx-auto w-3/4 sm:w-full" />
              {employees.map((employee, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectEmployee(employee)}
                  className={`bg-black relative shadow-md rounded-lg border mb-4 p-4 flex flex-col sm:flex-row gap-4 transition duration-300 hover:-translate-y-3 hover:shadow-lg cursor-pointer 
                    ${
                      selectedEmployeeId === employee
                        ? "border-4 border-blue-500"
                        : ""
                    }`}
                >
                  <div
                    className="bg-cover bg-center h-32 sm:h-40 md:h-48 w-full sm:w-32 md:w-40 rounded-lg flex-shrink-0"
                    style={{
                      backgroundImage: `url(${employee.employee_image_url})`,
                    }}
                  ></div>
                  <div className="text-white flex-1 text-center sm:text-left mt-2 sm:mt-0">
                    <p className="font-bold text-base sm:text-lg md:text-xl">
                      Name: {`${employee.first_name} ${employee.last_name}`}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm">
                      NickName: {employee.nickname}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm">
                      Gender: {employee.gender}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm">
                      Age: {calculateAge(employee.dob)} years
                    </p>
                    <p className="mt-1 text-xs sm:text-sm">
                      Position: {employee.position}
                    </p>
                    <div className="flex justify-center sm:justify-start gap-1 mt-1 text-xs sm:text-sm">
                      <p>Status:</p>
                      <p
                        className={`${
                          employee.status === "Active" ? "text-green-500" : ""
                        } ${
                          employee.status === "Inactive" ? "text-red-500" : ""
                        }`}
                      >
                        {employee.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Date & Time Section */}
            <div className="w-full lg:w-1/3 p-2">
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 p-2 capitalize text-center">
                Select Date & Time
              </h1>
              <hr className="border-black mb-4 mx-auto w-3/4 sm:w-full" />
              {/* Calendar Picker */}
              <div className="bg-black p-4 shadow-md rounded-md text-white">
                <div className="flex justify-between items-center mb-2">
                  <button
                    className={`text-white hover:text-gray-300 ${
                      selectedDate.isSame(today, "month")
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedDate((prev) => prev.subtract(1, "month"))
                    }
                    disabled={selectedDate.isSame(today, "month")}
                  >
                    &lt;
                  </button>
                  <span className="font-semibold text-sm sm:text-base md:text-lg">
                    {selectedDate.format("MMMM YYYY")}
                  </span>
                  <button
                    className="text-white hover:text-gray-300"
                    onClick={() =>
                      setSelectedDate((prev) => prev.add(1, "month"))
                    }
                  >
                    &gt;
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs sm:text-sm">
                  {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((day) => (
                    <div key={day} className="font-semibold text-white">
                      {day}
                    </div>
                  ))}
                  {generateCalendar().map((day, index) => {
                    const fullDate = selectedDate.date(day);
                    return (
                      <button
                        key={index}
                        className={`p-1 sm:p-2 w-full ${
                          fullDate.isBefore(today, "day")
                            ? "opacity-50 cursor-not-allowed"
                            : fullDate.isSame(selectedDate, "day")
                            ? "bg-blue-500 text-white rounded-full"
                            : "hover:bg-gray-700"
                        }`}
                        onClick={() => setSelectedDate(fullDate)}
                        disabled={fullDate.isBefore(today, "day")}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="text-center text-sm sm:text-base font-semibold text-gray-700 my-2">
                เลือกวันที่: {selectedDate.format("DD MMMM YYYY")}
              </div>

              {/* Time Selector */}
              <div className="flex flex-col space-y-2 my-4 w-full">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableTimes.map((time, index) => {
                    const isPast = isPastTime(
                      time,
                      selectedDate.format("YYYY-MM-DD")
                    );
                    const isBooked = bookedTimes.includes(time);
                    const isDisabled = isPast || isBooked;
                    const isSelected =
                      time === selectedTimeText.replace("Selected Time: ", "");

                    return (
                      <button
                        key={index}
                        className={`px-2 py-1 sm:px-4 sm:py-2 rounded-md text-center text-xs sm:text-sm whitespace-nowrap transition 
                          ${
                            isBooked
                              ? "bg-red-500 text-white cursor-not-allowed"
                              : ""
                          }
                          ${
                            isPast
                              ? "bg-gray-400 text-white cursor-not-allowed"
                              : ""
                          }
                          ${
                            !isDisabled
                              ? "bg-black text-white hover:bg-opacity-80"
                              : ""
                          }
                          ${isSelected ? "bg-blue-500 text-white" : ""}`}
                        disabled={isDisabled}
                        onClick={() =>
                          !isDisabled && handleTimeSelect(index, time)
                        }
                      >
                        {convertToThaiTime(time)}
                      </button>
                    );
                  })}
                </div>
                {selectedTimeText && (
                  <div className="text-center text-sm sm:text-base font-semibold text-gray-700 my-2">
                    เวลาที่เลือก: {convertToThaiTime(selectedTimeText)}
                  </div>
                )}
              </div>
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleBooking_modal}
                  className="w-full max-w-xs sm:w-40 py-2 bg-black text-white rounded-md hover:bg-gray-700"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="py-16 sm:py-20 md:py-28"></div>
      </Layout>
    </div>
  );
};

export default Bookingbarber;