import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Layout from './components/Layout';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [selectedTime, setSelectedTime] = useState("Today");
  const [customDate, setCustomDate] = useState(false);
  const [summary, setSummary] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [topServices, setTopServices] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    series: [{ data: [], name: "Bookings" }],
    chart: { type: "bar", height: 350, toolbar: { show: false }, background: "#242529", foreColor: "#ffffff" },
    colors: ["#00A9E0", "#FF6347", "#32CD32", "#FFD700", "#8A2BE2"],
    plotOptions: { bar: { distributed: true, borderRadius: 4, columnWidth: "40%" } },
    xaxis: { categories: [] },
    yaxis: { title: { text: "Bookings" } },
  });

  const fetchDashboardSummary = async (params) => {
    try {
      const response = await axios.get(`${apiUrl}/dashboard/summary/`, { params });
      const data = response.data;
      setSummary(data);
      if (Array.isArray(data.top_services)) {
        setTopServices(data.top_services);
        const sortedTopServices = data.top_services.sort((a, b) => b.booking_count - a.booking_count);
        setChartOptions((prevState) => ({
          ...prevState,
          series: [{ data: sortedTopServices.map((service) => service.booking_count), name: 'Bookings' }],
          xaxis: { categories: sortedTopServices.map((service) => service.service_name) },
        }));
      } else {
        setTopServices([]);
        setChartOptions((prevState) => ({
          ...prevState,
          series: [{ data: [], name: 'Bookings' }],
          xaxis: { categories: [] },
        }));
      }
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      alert("Failed to load dashboard data. Please try again.");
    }
  };

  const handleTimeChange = (e) => {
    const value = e.target.value;
    setSelectedTime(value);
    setCustomDate(value === "Custom");
    setStartDate("");
    setEndDate("");

    switch (value) {
      case "Today":
        fetchDashboardSummary({ period: "today" });
        break;
      case "Last week":
        fetchDashboardSummary({ period: "last-7-days" });
        break;
      case "Last month":
        fetchDashboardSummary({ period: "last-month" });
        break;
      case "3 months ago":
        fetchDashboardSummary({ period: "last-3-months" });
        break;
      default:
        break;
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "start") {
      setStartDate(value);
    }
    if (name === "end") {
      setEndDate(value);
      if (startDate && value) {
        fetchDashboardSummary({ start_date: startDate, end_date: value });
      }
    }
  };

  const handleUpdateNow = () => {
    if (customDate && startDate && endDate) {
      fetchDashboardSummary({ start_date: startDate, end_date: endDate });
    } else {
      switch (selectedTime) {
        case "Today":
          fetchDashboardSummary({ period: "today" });
          break;
        case "Last week":
          fetchDashboardSummary({ period: "last-7-days" });
          break;
        case "Last month":
          fetchDashboardSummary({ period: "last-month" });
          break;
        case "3 months ago":
          fetchDashboardSummary({ period: "last-3-months" });
          break;
        default:
          fetchDashboardSummary({ period: "today" });
          break;
      }
    }
  };

  useEffect(() => {
    fetchDashboardSummary({ period: "today" });
  }, []);

  if (!summary) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="container mt-24 mx-auto">
        <div className="flex-1 ml-0">
          <header className="mb-2 text-start">
            <h1 className="text-2xl font-bold text-gray-800 p-2 ml-20 uppercase">Dashboard</h1>
            <h1 className="text-xl font-bold text-gray-800 p-2 capitalize">Access Information</h1>
            <hr className="bg-black border-black text-black border-2 px-2" />
          </header>

          <div className="text-xl font-bold text-gray-800 p-2 capitalize flex items-center gap-4 justify-between">
            <h1>Date: {customDate && startDate && endDate ? `${startDate} to ${endDate}` : summary.summary_date}</h1>
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
              <option value="Custom">Custom</option>
            </select>
          </div>

          {customDate && (
            <div className="flex items-center gap-2 justify-end text-xl font-bold text-gray-800 p-2 capitalize">
              <label className="text-gray-800">Start:</label>
              <input
                type="date"
                className="p-1 border rounded bg-[#242529] text-white"
                value={startDate}
                name="start"
                onChange={handleDateChange}
              />
              <label className="text-gray-800">End:</label>
              <input
                type="date"
                className="p-1 border rounded bg-[#242529] text-white"
                value={endDate}
                name="end"
                onChange={handleDateChange}
              />
            </div>
          )}
          <style>{`input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); }`}</style>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            {[
              { title: "New Booking", value: summary.bookings_today, img: "appointment.png" },
               // เปลี่ยนจาก In Progress เป็น Cancelled
              { title: "Customers Served", value: summary.served_customers, img: "income.png" },
              { title: "Cancelled", value: summary.cancelled_count, img: "cancel.png" },
              { title: "Daily Revenue", value: summary.revenue_day, img: "money.png" }, // ปรับชื่อรูปภาพให้เหมาะสม
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
                <div className="flex items-center mt-4">
                  <span className="inline-block w-10 h-10 mr-2 bg-[url(/src/img/time-count.png)] bg-cover"></span>
                  <button
                    className="font-semibold text-white capitalize hover:underline"
                    onClick={handleUpdateNow}
                  >
                    update now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="my-8">
            <div className="bg-white p-4 border rounded-lg shadow-lg">
              <h2 className="flex text-lg font-bold mb-4 justify-center">Top 5 Services</h2>
              <Chart options={chartOptions} series={chartOptions.series} type="bar" height={350} />
            </div>
          </div>
        </div>
      </div>
      <div className="py-20"></div>
    </Layout>
  );
};

export default Dashboard;