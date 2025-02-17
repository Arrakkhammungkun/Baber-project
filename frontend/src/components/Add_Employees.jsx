import { useState, } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

const apiUrl = import.meta.env.VITE_API_URL;

const AddEmployees = ({ isOpen = false, onClose = () => {}, onAddEmployee = () => {} }) => {
    const [employees, setEmployees] = useState({
        first_name: '',
        last_name: '',
        nickname: '',
        gender: 'none',
        dob: '',
        position: '',
        status: 'Active',
        employee_image_url: ''
    });

    // useEffect(() => {
    //     if (isOpen) {
            

    //         document.documentElement.style.overflow = 'hidden'; 
    //     } else {
    
    //         document.body.classList.remove('modal-open');  // เปิดการเลื่อนหน้าจอเมื่อ modal ปิด
    //     }
    
    //     return () => {
    //         document.body.classList.remove('modal-open');  // รีเซ็ตค่าเมื่อ component ถูก unmount
    //     };
    // }, [isOpen]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployees(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${apiUrl}/employee/`, employees);
            const newEmployee = response.data;

            await Swal.fire('สำเร็จ!', 'เพิ่มพนักงานเรียบร้อย!', 'success');
            onAddEmployee(newEmployee);
            
            setEmployees({
                first_name: '',
                last_name: '',
                nickname: '',
                gender: '',
                dob: '',
                position: '',
                status: 'Active',
                employee_image_url: ''
            });

            onClose();
        }catch (error) {
            console.error('Error adding employee:', error);
            const errorMessage = error.response?.data?.message || 'ไม่สามารถเพิ่มพนักงานได้!';
            Swal.fire('เกิดข้อผิดพลาด!', errorMessage, 'error');
          }
          
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
                        <option value="none" disabled className="text-gray-400">เลือกเพศ</option>
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
                        value={employees.dob}
                        onChange={handleChange}
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
};

AddEmployees.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onAddEmployee: PropTypes.func,
};

export default AddEmployees;
