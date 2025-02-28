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
const Bookingbarber = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);

  // ตั้งค่า locale เป็นภาษาไทย
  dayjs.locale("th");
  const { token, user } = useAuth();

  console.log("User ", user || "ไม่มีlogin");

  const { serviceId } = useParams();
  const [employees, setEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  // eslint-disable-next-line no-unused-vars
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
          console.log("Fetched data:", response.data);

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

    //
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
        // กรองเฉพาะพนักงานที่สถานะเป็น "Active"
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
      .catch((error) => console.error("Error fetching employees:", error))
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

  // const selectedTimeFormatted = dayjs(
  //   `${selectedDate.format("YYYY-MM-DD")} ${selectedTimeText.replace("Selected Time: ", "").trim()}`,
  //   "YYYY-MM-DD h:mm A"
  // ).local().utc().format("YYYY-MM-DDTHH:mm:ss[Z]");

  // const selectedTimeFormatted = dayjs(
  //   `${selectedDate.format("YYYY-MM-DD")} ${selectedTimeText.replace("Selected Time: ", "").trim()}`,
  //   "YYYY-MM-DD h:mm A"
  // ).local().utc().format("YYYY-MM-DDTHH:mm:ss[Z]"); // ส่งเวลาใน UTC

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
    console.log(selectedTimeFormatted);
    try {
      const response = await axios.post(`${apiUrl}/bookings/`, bookingData);
      console.log("Booking successful:", response.data);
      Swal.fire({
        icon: "success",
        title: "Booking successful!",
        confirmButtonText: "ตกลง",
      });
      console.log("booking", bookingData);

      setBookedTimes((prevBookedTimes) => [
        ...prevBookedTimes,
        selectedTimeText.replace("Selected Time: ", ""),
      ]);

      // อัพเดท availableTimes
      const filteredAvailableTimes = availableTimes.filter(
        (time) => time !== selectedTimeText.replace("Selected Time: ", "")
      );
      setAvailableTimes(filteredAvailableTimes);
      setIsLoading(false);
      setShowModal(false);
    } catch (error) {
      setShowModal(false);
      console.error("Error making booking:", error.response.data);
      Swal.fire({
        icon: "error",
        title: "Failed to make booking. Please try again.",
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
          <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-50 flex items-center justify-center px-4">
            <div className="bg-white text-black p-6 rounded-xl w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-4 text-center">
                สรุปข้อมูลการจอง
              </h2>
              <hr />

              <p className="text-lg font-bold mt-2">รายการที่เลือก</p>
              <div className="text-base text-black mt-1 p-2">
                {/* Section บริการ */}
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div
                    className="w-24 h-24 bg-cover bg-center rounded-lg"
                    style={{ backgroundImage: `url(${Service.image_url})` }}
                  ></div>
                  <div>
                    <p>
                      <strong>บริการ:</strong>{" "}
                      {Service ? `${Service.name} ` : "ยังไม่เลือก"}
                    </p>
                    <p className="mt-1">
                      <strong>รายละเอียด:</strong>{" "}
                      {Service ? `${Service.description} ` : "ยังไม่เลือก"}
                    </p>
                  </div>
                </div>

                {/* Section พนักงาน */}
                <div className="flex flex-col sm:flex-row items-start gap-4 mt-4">
                  <div
                    className="w-24 h-24 bg-cover bg-center rounded-lg"
                    style={{
                      backgroundImage: `url(${selectedEmployeeId.employee_image_url})`,
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
                      {selectedEmployeeId
                        ? `${selectedEmployeeId.nickname} `
                        : "ยังไม่เลือก"}
                    </p>

                    <div className="flex gap-4 text-base mt-1">
                      <p>
                        <strong>เพศ:</strong>{" "}
                        {selectedEmployeeId
                          ? `${selectedEmployeeId.gender}`
                          : "ยังไม่เลือก"}
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

                <p className="text-lg font-bold mt-4">วันที่จอง</p>
                <hr />
                <div className="mt-2 space-y-2">
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
                    <span>
                      {Service ? `${Service.duration} นาที` : "ยังไม่เลือก"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <strong>ค่าบริการ:</strong>
                    <span>
                      {Service ? `${Service.price} บาท` : "ยังไม่เลือก"}
                    </span>
                  </div>
                </div>

                <p className="text-center text-sm mt-4">
                  **หมายเหตุ** โปรดมาตรงเวลา
                </p>
              </div>

              {/* ปุ่ม */}
              <div className="mt-4 flex flex-col sm:flex-row justify-between gap-2">
                <button
                  onClick={cancelBooking}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 w-full sm:w-auto"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleBooking}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full sm:w-auto"
                >
                  ยืนยันการจอง
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="container mt-24 mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 p-2 ml-20 uppercase">
            Booking
          </h1>
          <div className="flex justify-between w-full">
            {/* Barber Section */}
            <div className="ml-10 w-full mr-2 p-2">
              <h1 className="text-xl font-bold text-gray-800 p-2 capitalize">
                Barber
              </h1>
              <hr className="bg-black border-black text-black border px-2 mb-5" />
              {employees.map((employee, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectEmployee(employee)} // เมื่อคลิกเลือกพนักงาน
                  className={`bg-black relative shadow-md rounded-lg border mb-2 p-4 h-auto flex flex-col sm:flex-row transition duration-300 hover:-translate-y-3 hover:shadow-lg cursor-pointer 
                  ${
                    selectedEmployeeId === employee
                      ? "border-4 border-blue-500 "
                      : ""
                  }`} // เพิ่ม border สีฟ้าเมื่อเลือกพนักงาน
                >
                  <div
                    className="bg-cover bg-center h-[150px] sm:h-[200px] sm:w-[150px] md:h-[250px] md:w-[200px] rounded-lg"
                    style={{
                      backgroundImage: `url(${employee.employee_image_url})`,
                    }}
                  ></div>
                  <div className="text-md text-white flex-1 px-4 mt-4 sm:mt-0 sm:pl-4">
                    <p className="font-bold text-xl">
                      Name : {`${employee.first_name} ${employee.last_name}`}
                    </p>
                    <p className="mt-1">NickName : {employee.nickname}</p>
                    <p className="mt-1">Gender : {employee.gender}</p>
                    <p className="mt-1">
                      Age : {calculateAge(employee.dob)} years
                    </p>
                    <p className="mt-1">Position: {employee.position}</p>
                    <div className="flex items-center gap-1">
                      <p>Position:</p>
                      <p
                        className={`${
                          employee.status === "Active" ? "text-green-500" : ""
                        } 
                                    ${
                                      employee.status === "Inactive"
                                        ? "text-red-500"
                                        : ""
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
            <div className="w-full md:w-1/2 lg:w-1/3 mx-auto p-2">
              <h1 className="text-xl font-bold text-gray-800 p-2 capitalize text-center">
                Select Date & Time
              </h1>
              <hr className="border-black mb-4" />
              {/* Calendar Picker */}
              <div className="bg-black p-4 shadow-md rounded-md text-white">
                <div className="flex justify-between items-center mb-2">
                  <button
                    className={`text-white hover:text-black ${
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
                  <span className="font-semibold text-lg">
                    {selectedDate.format("MMMM YYYY")}
                  </span>
                  <button
                    className="text-white hover:text-black"
                    onClick={() =>
                      setSelectedDate((prev) => prev.add(1, "month"))
                    }
                  >
                    &gt;
                  </button>
                </div>
                <div className="grid grid-cols-7 text-center">
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
                        className={`p-2 w-full ${
                          fullDate.isBefore(today, "day")
                            ? "opacity-50 cursor-not-allowed"
                            : fullDate.isSame(selectedDate, "day")
                            ? "bg-blue-500 text-white rounded-full"
                            : "hover:bg-gray-200"
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
              <div className="text-center text-lg font-semibold text-gray-700 my-2">
                เลือกวันที่ : {selectedDate.format("DD MMMM YYYY")}
              </div>

              {/* Time Selector */}
              <div className="flex flex-col space-y-2 my-4 w-full justify-center">
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time, index) => {
                    const isPast = isPastTime(
                      time,
                      selectedDate.format("YYYY-MM-DD")
                    );
                    const isBooked = bookedTimes.includes(time);
                    const isDisabled = isPast || isBooked;

                    const isSelected =
                      time === selectedTimeText.replace("Selected Time: ", ""); // เช็คว่าเป็นเวลาที่เลือกหรือไม่

                    return (
                      <button
                        key={index}
                        className={`px-4 py-2 rounded-md text-center whitespace-nowrap transition 
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
                          ${
                            isSelected ? "bg-blue-500 text-black " : ""
                          }  // สีจางๆ เมื่อเลือกแล้ว
                        `}
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
                  <div className="text-center text-lg font-semibold text-gray-700 my-2">
                    เวลาที่เลือก : {convertToThaiTime(selectedTimeText)}
                  </div>
                )}
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={handleBooking_modal}
                  className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-700"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="py-28"></div>
      </Layout>
    </div>
  );
};

export default Bookingbarber;
