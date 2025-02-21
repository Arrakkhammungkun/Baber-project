import { useState } from "react";
import Chart from "react-apexcharts";
import Layout from './components/Layout';

const Dashboard = () => {
  const [selectedTime, setSelectedTime] = useState("");
  const [customDate, setCustomDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleTimeChange = (e) => {
    const value = e.target.value;
    setSelectedTime(value);
    setCustomDate(value === "Custom");
  };

  const barChartOptions = {
    series: [{ data: [30, 15, 18, 23, 20], name: "Person" }],
    chart: { type: "bar", height: 350, toolbar: { show: false }, background: "#242529", foreColor: "#ffffff" },
    colors: ["#00A9E0", "#FF6347", "#32CD32", "#FFD700", "#8A2BE2"],
    plotOptions: { bar: { distributed: true, borderRadius: 4, columnWidth: "40%" } },
    xaxis: { categories: ["Men's haircut", "Hair Dyed", "Hair Shower", "Women's haircut", "Spa"] },
    yaxis: { title: { text: "Person" } },
  };

  return (
    <Layout>
      <div className="container mt-24 mx-auto">
        <div className="flex-1 ml-0">
          <header className="mb-2 text-start">
            <h1 className="text-2xl font-bold text-gray-800 p-2 ml-20 uppercase">Dashboard</h1>
            <h1 className="text-xl font-bold text-gray-800 p-2 capitalize">Access Information</h1>
            <hr className="bg-black border-black text-black border-2 px-2" />
          </header>

          {/* Date and select time */}
          <div className="text-xl font-bold text-gray-800 p-2 capitalize flex items-center gap-4 justify-between">
            <h1>Date : 02/07/2025 : 00:00 PM.</h1>
            <select
              className="select select-end w-auto max-w-xs bg-[#242529] text-white"
              value={selectedTime}
              onChange={handleTimeChange}
            >
              <option value="" disabled>Select Time</option>
              <option value="Today">Today</option>
              <option value="Last week">Last week</option>
              <option value="Last month">Last month</option>
              <option value="3 months ago">3 months ago</option>
              <option value="6 months ago">6 months ago</option>
              <option value="Latest year">Latest year</option>
              <option value="Custom">Custom</option>
            </select>

            
          </div>
            {/* Show startDate & endDate when 'Custom' is selected */}
            {customDate && (
              <div className="flex items-center gap-2 justify-end text-xl font-bold text-gray-800 p-2 capitalize">
                <label className="text-gray-800">Start:</label>
                <input
                  type="date"
                  className="p-1 border rounded bg-[#242529] text-white"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  
                />
                <label className="text-gray-800">End:</label>
                <input
                  type="date"
                  className="p-1 border rounded bg-[#242529] text-white"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              
            )}
            {/* CSS Style สำหรับเปลี่ยนสีของไอคอนปฏิทิน */}
          <style>
            {`
              input[type="date"]::-webkit-calendar-picker-indicator {
                filter: invert(1); /* ทำให้ไอคอนเป็นสีขาว */
              }
            `}
          </style>
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            {[
              { title: "booking", value: "249", img: "appointment.png" },
              { title: "use", value: "83", img: "hair-clipper1.png" },
              { title: "income", value: "79", img: "income.png" },
              { title: "cancel", value: "56", img: "cancel.png" },
            ].map((card, index) => (
              <div key={index} className="bg-[#242529] p-4 rounded-lg shadow-xl">
                <div className="flex items-center justify-between border-b border-white pb-4">
                  <div>
                    <p className="font-bold text-white uppercase">{card.title}</p>
                    <span className="text-2xl font-semibold mt-2 text-white">{card.value}</span>
                  </div>
                  <div className="bg-gradient-to-b from-slate-100 to-slate-300 shadow-md shadow-slate-800 w-12 h-12 items-center flex justify-center rounded-lg">
                    <span className={`inline-block w-10 h-10 bg-[url(/src/img/${card.img})] bg-cover`}></span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center mt-4">
                    <span className="inline-block w-10 h-10 mr-2 bg-[url(/src/img/time-count.png)] bg-cover"></span>
                    <button className="font-semibold text-white capitalize hover:underline">update now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="my-8">
            <div className="bg-white p-4 border rounded-lg shadow-lg">
              <h2 className="flex text-lg font-bold mb-4 justify-center">Top 5 Services</h2>
              <Chart options={barChartOptions} series={barChartOptions.series} type="bar" height={350} />
            </div>
          </div>
        </div>
      </div>
      
    </Layout>

    
  );

  
};



export default Dashboard;
