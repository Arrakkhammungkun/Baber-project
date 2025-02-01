import { useState,useEffect } from 'react';
import axios from 'axios';
const apiUrl =import.meta.env.VITE_API_URL;
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
function Edit_Employees({ isOpen, onClose, employeesId, onUpdateEmployees}) {
    const [employees, setemployees] = useState({
        first_name: '',
        last_name: '',
        nickname: '',
        gender: '',
        dob: '',
        position: '',
        status: '',
        employee_image_url: ''
    });
    const [date, setDate] = useState("");
    useEffect(() => {
        if (isOpen && employeesId) {
            const isoString = "2022-12-26T00:00:00Z"; 
            const formattedDate = isoString.split("T")[0]; 
            setDate(formattedDate);
            
            axios
                .get(`${apiUrl}/employee/${employeesId}/`)
                .then((response) => {
                    console.log("Response data:", response.data);
                    setemployees({
                        first_name:response.data.first_name,
                        last_name: response.data.last_name,
                        nickname: response.data.nickname,
                        gender:  response.data.gender,
                        dob:  response.data.dob,
                        position: response.data.position,
                        status: response.data.status,
                        employee_image_url: response.data.employee_image_url
                    });
                })
                .catch((error) => {
                    console.error('Error fetching service data:', error);
                });
            return ()=>{
                
            };
        }
    }, [isOpen, employeesId,]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setemployees({
            ...employees,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // แสดง SweetAlert2 เพื่อยืนยันการอัปเดตบริการ
        Swal.fire({
          title: 'ยืนยันการดำเนินการ?',
          text: 'คุณต้องการอัปเดตข้อมูลบริการนี้หรือไม่?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'ยืนยัน',
          cancelButtonText: 'ยกเลิก'
        }).then(async (result) => {
          if (result.isConfirmed) {
            // หากผู้ใช้ยืนยันให้ทำการอัปเดตบริการ
            try {
              const response = await axios.put(`${apiUrl}/employee/${employeesId}/`, {
                first_name:employees.first_name,
                last_name: employees.last_name,
                nickname: employees.nickname,
                gender:  employees.gender,
                dob:  employees.dob,
                position:employees.position,
                status: employees.status,
                employee_image_url: employees.employee_image_url
              });
              
              // แสดงข้อความว่าการอัปเดตสำเร็จ
              await Swal.fire('ยืนยันแล้ว!', 'การอัปเดตบริการเสร็จสมบูรณ์!', 'success');
      
              onUpdateEmployees(response.data); // อัปเดตข้อมูลใน component หลัก
              onClose();
            } catch (error) {
              console.error('Error updating service:', error);
              Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถอัปเดตบริการได้!', 'error');
            }
          } else if (result.isDismissed) {
            // หากผู้ใช้กด "ยกเลิก" ให้แสดงข้อความยกเลิก
            Swal.fire('ยกเลิกแล้ว!', 'การดำเนินการถูกยกเลิก!', 'error');
          }
        });
      };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 h-screen w-full flex justify-center items-center bg-black/70">
            <form onSubmit={handleSubmit} className="bg-black p-4 rounded-lg shadow-md w-[90%] max-w-md">
                <h2 className="text-2xl font-bold text-center mb-[-1rem] text-white">เพิ่มพนักงาน</h2>

                <button
                    type="button"
                    onClick={onClose}
                    className="relative  -top-[30px] -right-[96%]   text-gray-600 hover:text-gray-800 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className='h-8 w-8' viewBox="0 0 512 512"><path fill="#ffffff" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>

                </button>

                <div className="mb-3">
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        className="w-full bg-gray-100 p-2 rounded-md"
                        value={employees.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        className="w-full bg-gray-100 p-2 rounded-md"
                        value={employees.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        name="nickname"
                        placeholder="Nickname"
                        className="w-full bg-gray-100 p-2 rounded-md"
                        value={employees.nickname}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <select
                        name="gender"
                        className="w-full bg-gray-100 p-2 rounded-md"
                        value={employees.gender}
                        onChange={handleChange}
                    >
                        <option value="Male">ชาย</option>
                        <option value="Female">หญิง</option>
                        <option value="Other">อื่นๆ</option>
                    </select>
                </div>

                <div className="mb-3">
                    <input
                        type="date"
                        name="dob"
                        className="w-full bg-gray-100 p-2 rounded-md"
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                        required
                    />
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        name="position"
                        placeholder="Position"
                        className="w-full bg-gray-100 p-2 rounded-md"
                        value={employees.position}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <select
                        name="status"
                        className="w-full bg-gray-100 p-2 rounded-md"
                        value={employees.status}
                        onChange={handleChange}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <div className="mb-3">
                    <input
                        type="text"
                        name="employee_image_url"
                        placeholder="Image URL"
                        className="w-full bg-gray-100 p-2 rounded-md"
                        value={employees.employee_image_url}
                        onChange={handleChange}
                    />
                </div>

                <div className='flex justify-end'>
                    <button type="submit" className='bg-[#00BA9A] text-white rounded-md py-3 px-8 inline-block jastify-center hover:bg-[#0A836E] transition duration-300'>Save</button>
                </div>
            </form>
        </div>
    );
}
Edit_Employees.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    employeesId: PropTypes.string,
    onUpdateEmployees: PropTypes.func, // onClose ต้องเป็น function และต้องส่งมาเสมอ
  };
export default Edit_Employees;
