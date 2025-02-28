import { useState } from "react";
import dayjs from "dayjs"; // ติดตั้งด้วย npm install dayjs
import LayoutAdmin from "./components/LayoutAdmin";
const DateTimePicker = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState(0);
  const times = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"];

  // ฟังก์ชันสร้างปฏิทิน
  const generateCalendar = () => {
    const startOfMonth = selectedDate.startOf("month").day(); // หาวันเริ่มต้นของเดือน
    const daysInMonth = selectedDate.daysInMonth(); // หาจำนวนวันในเดือน

    let daysArray = Array.from({ length: startOfMonth }, () => null); // เติมช่องว่างก่อนวันแรก
    daysArray = daysArray.concat(
      [...Array(daysInMonth).keys()].map((i) => i + 1)
    ); // เติมวันที่

    return daysArray;
  };

  return (
    <LayoutAdmin>
      <div className="w-full md:w-1/2 lg:w-1/3 mx-auto p-4">
        <h1 className="text-xl font-bold text-gray-800 p-2 capitalize text-center">
          Select Date & Time
        </h1>
        <hr className="border-black mb-4" />

        {/* Calendar Picker */}
        <div className="bg-white p-4 shadow-md rounded-md">
          <div className="flex justify-between items-center mb-2">
            <button
              className="text-gray-600 hover:text-black"
              onClick={() =>
                setSelectedDate((prev) => prev.subtract(1, "month"))
              }
            >
              &lt;
            </button>
            <span className="font-semibold text-lg">
              {selectedDate.format("MMMM YYYY")}
            </span>
            <button
              className="text-gray-600 hover:text-black"
              onClick={() => setSelectedDate((prev) => prev.add(1, "month"))}
            >
              &gt;
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 text-center">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div key={day} className="font-semibold text-gray-600">
                {day}
              </div>
            ))}
            {generateCalendar().map((day, index) => (
              <button
                key={index}
                className={`p-2 w-full ${
                  day === selectedDate.date()
                    ? "bg-blue-500 text-white rounded-full"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setSelectedDate(selectedDate.date(day))}
                disabled={!day}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Date Display */}
        <div className="text-center text-lg font-semibold text-gray-700 my-2">
          Selected Date: {selectedDate.format("DD MMMM YYYY")}
        </div>

        {/* Time Selector */}
        <div className="flex items-center space-x-2 my-4 w-full justify-center">
          <button
            className={`bg-[#3A3A3A] text-white px-3 py-1 rounded-md transition ${
              selectedTime === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => setSelectedTime((prev) => Math.max(0, prev - 1))}
            disabled={selectedTime === 0}
          >
            &lt;
          </button>

          <div className="flex space-x-2 overflow-hidden">
            {times.slice(selectedTime, selectedTime + 3).map((time, index) => (
              <button
                key={index}
                className="bg-[#545454] text-white px-4 py-2 rounded-md w-[100px] text-center hover:bg-gray-500"
              >
                {time}
              </button>
            ))}
          </div>

          <button
            className={`bg-[#3A3A3A] text-white px-3 py-1 rounded-md transition ${
              selectedTime >= times.length - 3
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={() =>
              setSelectedTime((prev) => Math.min(times.length - 3, prev + 1))
            }
            disabled={selectedTime >= times.length - 3}
          >
            &gt;
          </button>
        </div>

        {/* Book Now Button */}
        <button className="bg-[#242529] text-white px-6 py-2 rounded-md hover:bg-gray-700 transition duration-300 w-full max-w-[400px] mx-auto block">
          Book now
        </button>
      </div>
    </LayoutAdmin>
  );
};

export default DateTimePicker;
