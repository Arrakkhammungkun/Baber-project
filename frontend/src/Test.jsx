import { useEffect, useState } from 'react';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const Bookingbarber = () => {
  const [summary, setSummary] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  const fetchDashboardSummary = async (endpoint, startDate, endDate) => {
    try {
      const response = await axios.get(`${apiUrl}${endpoint}`, {
        params: {
          start_date: startDate,
          end_date: endDate
        }
      });
      setSummary(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
    }
  };

  const handleDropdownSelection = (timeframe) => {
    let start = new Date();
    let end = new Date();
    let endpoint = '';

    switch (timeframe) {
      case 'current-day':
        start.setHours(0, 0, 0, 0); // ตั้งเวลาของวันปัจจุบันให้เป็นเที่ยงคืน
        end.setHours(23, 59, 59, 999); // ตั้งเวลาของวันปัจจุบันให้เป็นก่อนเที่ยงคืน
        endpoint = '/revenue/current-day';
        break;
      case 'current-month':
        start.setDate(1); // เริ่มต้นวันที่ 1 ของเดือน
        start.setHours(0, 0, 0, 0); // ตั้งเวลาของวันที่ 1 ให้เป็นเที่ยงคืน
        endpoint = '/revenue/current_month';
        break;
      case 'last-7-days':
        start.setDate(end.getDate() - 7);
        endpoint = '/revenue/last-7-days';
        break;
      case 'last-month':
        start.setMonth(end.getMonth() - 1);
        endpoint = '/revenue/last-month';
        break;
      case 'last-3-months':
        start.setMonth(end.getMonth() - 3);
        endpoint = '/revenue/last-3-months';
        break;
      default:
        break;
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
    fetchDashboardSummary(endpoint, start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'start') {
      setStartDate(value);
      if (value && endDate) {
        fetchDashboardSummary('/revenue', value, endDate);
      }
    }
    if (name === 'end') {
      setEndDate(value);
      if (startDate && value) {
        fetchDashboardSummary('/revenue', startDate, value);
      }
    }
  };

  useEffect(() => {
    fetchDashboardSummary('/revenue', startDate, endDate);  // Default load all revenue data
  }, []);

  if (!summary) return <div>Loading...</div>;

  return (
    <div>
      <div className="dropdown dropdown-end ml-40">
        <div tabIndex={0} role="button" className="btn m-1">Select Timeframe</div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          <li><a onClick={() => handleDropdownSelection('current-day')}>Today</a></li>
          <li><a onClick={() => handleDropdownSelection('current-month')}>Current Month</a></li>
          <li><a onClick={() => handleDropdownSelection('last-7-days')}>Last 7 days</a></li>
          <li><a onClick={() => handleDropdownSelection('last-month')}>Last month</a></li>
          <li><a onClick={() => handleDropdownSelection('last-3-months')}>Last 3 months</a></li>
        </ul>
      </div>

      <div className="date-picker">
        <input 
          type="date" 
          name="start" 
          value={startDate || ''} 
          onChange={handleDateChange}
        />
        <input 
          type="date" 
          name="end" 
          value={endDate || ''} 
          onChange={handleDateChange}
        />
      </div>

      <h2>Dashboard Summary</h2>
      <p>จำนวนลูกค้าที่จองคิววันนี้: {summary.bookings_today}</p>
      <p>จำนวนลูกค้าที่รับบริการแล้ว: {summary.served_customers}</p>
      <p>คิวที่กำลังดำเนินการ: {summary.in_progress_count}</p>
      <h3>รายได้รวม</h3>
      <p>วันนี้: {summary.revenue_day}</p>
      <p>เดือนนี้: {summary.revenue_month}</p>
      <p>ปีนี้: {summary.revenue_year}</p>
    </div>
  );
};

export default Bookingbarber;
