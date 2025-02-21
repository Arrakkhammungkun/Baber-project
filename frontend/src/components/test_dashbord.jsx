import { useEffect, useState } from 'react';
import axios from 'axios';
const apiUrl =import.meta.env.VITE_API_URL;
const Dashboard = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        const response = await axios.get(`${apiUrl}/dashboard/summary/`);
        setSummary(response.data);
      } catch (error) {
        console.error("Error fetching dashboard summary:", error);
      }
    };

    fetchDashboardSummary();
  }, []);

  if (!summary) return <div>Loading...</div>;

  return (
    <div>
      <h2>Dashboard Summary</h2>
      <p>จำนวนลูกค้าที่จองคิววันนี้: {summary.bookings_today}</p>
      <p>จำนวนลูกค้าที่รับบริการแล้ว: {summary.served_customers}</p>
      <p>คิวที่กำลังดำเนินการ: {summary.in_progress_count}</p>
      <h3>รายได้รวม</h3>
      <p>วันนี้: {summary.revenue_day}</p>
      <p>เดือนนี้: {summary.revenue_month}</p>
      <p>ปีนี้: {summary.revenue_year}</p>
      <p>อัปเดตล่าสุด: {new Date(summary.updated_at).toLocaleString()}</p>
    </div>
  );
};

export default Dashboard;
