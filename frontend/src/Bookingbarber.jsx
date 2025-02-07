import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import Layout from "./components/Layout";
import axios from "axios";

const Bookingbarber = () => {
  const [services, setServices] = useState([]);
  const [checked, setChecked] = useState(false);
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedTime, setSelectedTime] = useState(0);

  const dates = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const times = ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM"];

  useEffect(() => {
    axios
      .get(`${apiUrl}/services/`)
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, []);

  return (
    <div>
      <Layout>
        <div className="container mt-24 mx-auto">
          <header className="mb-2 text-start">
            <h1 className="text-2xl font-bold text-gray-800 p-2 ml-20 uppercase">
              Booking
            </h1>
          </header>
          <div className="flex justify-between">
            {/* Barber Section */}
            <div className="ml-10 w-1/2 mr-2">
              <h1 className="text-xl font-bold text-gray-800 p-2 capitalize">
                Barber
              </h1>
              <hr className="bg-black border-black text-black border px-2 mb-5" />
              <div
                className="bg-black shadow-md rounded-lg border p-4 h-[250px] flex transition duration-300 hover:-translate-y-3 hover:shadow-lg cursor-pointer"
                onClick={() => setChecked(!checked)}
              >
                <div className="bg-[url('/src/img/14.jpg')] bg-cover bg-center h-full w-[200px] rounded-lg"></div>
                <div className="text-xl text-white  p-2 flex-1">
                  <p className="uppercase font-bold">ARCHIE WILLIAMS</p>
                  <p className="mt-3">
                    A versatile master of haircuts of any complexity who loves
                    his job.
                  </p>
                  <p className="mt-3">Position : Barber</p>
                  <p className="mt-3">Experience : 11 years</p>
                </div>
                <div className="flex items-start pl-4">
                  <input
                    className="accent-purple-500 w-5 h-5 pointer-events-none"
                    type="checkbox"
                    checked={checked}
                    readOnly
                  />
                </div>
              </div>
            </div>

            {/* Date & Time Section */}
            <div className="mr-10 w-1/2">
              <h1 className="text-xl font-bold text-gray-800 p-2 capitalize">
                Date & Timer
              </h1>
              <hr className="bg-black border-black text-black border px-2 mb-5" />
              <div className="p-4 flex flex-col items-center">
                
                
                <div className="flex items-center space-x-2 mb-4">
                  <button
                    className={`bg-[#3A3A3A] text-white px-3 py-1 rounded-md transition ${selectedDate === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => setSelectedDate((prev) => Math.max(0, prev - 1))}
                    disabled={selectedDate === 0}
                  >
                    &lt;
                  </button>
                  <div className="flex space-x-2 overflow-hidden">
                    {dates.slice(selectedDate, selectedDate + 3).map((date, index) => (
                      <button
                        key={index} 
                        className="bg-[#545454] text-white px-4 py-2 rounded-md w-[120px] text-center hover:bg-gray-500"
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                  <button
                    className={`bg-[#3A3A3A] text-white px-3 py-1 rounded-md transition ${selectedDate >= dates.length - 3 ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => setSelectedDate((prev) => Math.min(dates.length - 3, prev + 1))}
                    disabled={selectedDate >= dates.length - 3}
                  >
                    &gt;
                  </button>
                </div>

                {/* Time Selector with Animation */}
                <div className="flex items-center space-x-2 mb-4">
                  <button
                    className={`bg-[#3A3A3A] text-white px-3 py-1 rounded-md transition ${selectedTime === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => setSelectedTime((prev) => Math.max(0, prev - 1))}
                    disabled={selectedTime === 0}
                  >
                    &lt;
                  </button>
                  <div className="flex space-x-2 overflow-hidden">
                    {times.slice(selectedTime, selectedTime + 3).map((time, index) => (
                      <button 
                        key={index} 
                        className="bg-[#545454] text-white px-4 py-2 rounded-md  w-[120px] text-center hover:bg-gray-500"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  <button
                    className={`bg-[#3A3A3A] text-white px-3 py-1 rounded-md transition ${selectedTime >= times.length - 3 ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => setSelectedTime((prev) => Math.min(times.length - 3, prev + 1))}
                    disabled={selectedTime >= times.length - 3}
                  >
                    &gt;
                  </button>
                </div>

                
                <button className="bg-[#242529] text-white px-6 py-2 rounded-md  hover:bg-gray-700 transition duration-300 w-[400px]">
                  Book now
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Bookingbarber;
