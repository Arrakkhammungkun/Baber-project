import { useEffect, useState } from "react";
const apiUrl =import.meta.env.VITE_API_URL;
import Layout from './components/Layout';
import axios from "axios";

import Swal from 'sweetalert2';
const Manage_Employee = () => {
  const [employee, setemployee] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState(null);
  function calculateAge(dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  useEffect(() => {
    
    axios
      .get(`${apiUrl}/employee/`)
      .then((response) => {
        setemployee(response.data); 
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, []);
  const handleEdit = (serviceId) => {
    setSelectedServiceId(serviceId);
    setIsEditModalOpen(true);
    
  };
  const handleAdd = (service) => {
    setIsModalOpen(true);
    console.log(service); 
    
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleUpdateService = (updatedService) => {
    setServices((prevServices) =>
        prevServices.map((service) =>
            service.id === updatedService.id ? updatedService : service
        )
      );
  };
  const handleDelete = async (serviceId) => {
   
    Swal.fire({
      title: 'ยืนยันการดำเนินการ?',
      text: 'คุณต้องการยืนยันการดำเนินการนี้หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        
        try {
          const response = await axios.delete(`${apiUrl}/services/${serviceId}/`);
          console.log("Service deleted:", response.data);
          await Swal.fire('ยืนยันแล้ว!', 'การดำเนินการเสร็จสมบูรณ์!', 'success');
          setServices((prevServices) =>
            prevServices.filter((service) => service.id !== serviceId)
          );
        } catch (error) {
          console.error("Error deleting service:", error);
          
          Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถลบบริการได้!', 'error');
        }
      } else if (result.isDismissed) {
        // หากผู้ใช้กด "ยกเลิก" ให้แสดงข้อความยกเลิก
        Swal.fire('ยกเลิกแล้ว!', 'การดำเนินการถูกยกเลิก!', 'error');
      }
    });
  };

  const handleAddService = (newService) => {
    setServices((prevServices) => [...prevServices, newService]); // อัปเดต state ทันทีที่เพิ่ม
  };

  
  return (
    <div >
        <Layout>

       <div className='container mt-24 mx-auto '>

       
      <header className="mb-2 text-start ">
        <h1 className="text-2xl font-bold text-gray-800 p-2 ml-20">MANAGEMENT</h1>
        <h1 className="text-xl font-bold text-gray-800 p-2 ml-10">Barber Information</h1>
        <hr className='bg-black border-black text-black border-2 px-2' />
      </header>
      <div className="max-w-full mx-auto bg-white shadow-md rounded-lg p-4">
        {/* <div className="flex gap-2 mr-8">
            <div className="border-black p-2 text-center  border-[3px] rounded-md w-36 ">
                NO.
            </div>
            <div className="border-black p-2 text-center  border-[3px] rounded-md w-36 ">
                Name
            </div>
            <div className="border-black p-2 text-center  border-[3px] rounded-md w-36 ">
                Sex
            </div>
            <div className="border-black p-2 text-center  border-[3px] rounded-md w-36 ">
                Age
            </div>
            <div className="border-black p-2 text-center  border-[3px] rounded-md w-36 ">
                Job position
            </div>
            <div className="border-black p-2 text-center  border-[3px] rounded-md w-36 ">
                Working Status
            </div>



        </div> */}


        <table className="w-full border border-gray-600 text-white mt-5 ">
  <thead className="relative -top-3">
    <tr className="bg-white text-black">
      <th className="border-[3px] p-2 rounded-l-3xl border-black">No.</th>
      <th className="border-[3px] p-2 border-black">Name</th>
      <th className="border-[3px] p-2 border-black">Sex</th>
      <th className="border-[3px] p-2 border-black">Age</th>
      <th className="border-[3px] p-2 border-black">Job Position</th>
      <th className="border-[3px] p-2 border-black">Working Status</th>
      <th className="border-[3px] p-2 rounded-r-3xl border-black">Manage</th>
    </tr>
  </thead>
  <tbody>
    {employee.map((employee, index) => (
      <tr key={employee.id} className="bg-black text-white text-center">
        <td className="border-[1px]  border-black p-2 ">{index + 1}</td>
        <td className="border-[1px] p-2 border-black">{employee.first_name} {employee.last_name}</td>
        <td className="border-[1px] p-2 border-black">{employee.gender}</td>
        <td className="border-[1px] p-2 border-black">{calculateAge(employee.dob)} ปี</td>
        <td className="border-[1px] p-2 border-black ">{employee.position}</td>
        <td className="border-[1px] p-2 border-black">{employee.status}</td>
        <td className="border-[3px] p-2 flex gap-2 justify-center border-black">
          <button className="p-2   ">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 512 512">
            <path fill="#ffffff" d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/>
            </svg>

          </button>
          <button
            onClick={() => handleDelete(employee.id)}
            className="p-2 rounded text-white"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 448 512"><path fill="#db1414" d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>

            </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>





       


      {/* {employee.map((employee) => (
            <div key={employee.id}> 
                <div className='flex items-start'>
                    <div className="flex justify-between items-center bg-black w-full px-4 p-1 mb-2 rounded-md shadow-sm">
                        <div>
                            <p className="text-white font-medium bg-black p-3">{employee.first_name}</p>
                        </div>
                    </div> 
                    <div className="flex space-x-2 h-full md:ml-16 ml-8 pt-0 items-start">
                        <button
                            className="md:px-16 px-5 w-full h-full py-4 bg-[#545454] text-white text-sm rounded-md hover:bg-[#464545]"
                            onClick={() => handleEdit(employee.id)} 
                        >
                            Edit
                        </button>
                        <button
                            className="md:px-14 px-5 py-4 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                            onClick={() => handleDelete(employee.id)}  
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        )   
        )} */}
        <div className='flex justify-end mt-3 mb-8'>
            <button onClick={handleAdd} className="md:px-[5rem] px-6 py-4 bg-black text-white text-sm rounded-md hover:bg-[#464545]">
                +Add
            </button>
        </div>
      </div>
      </div>
      <div className='my-[18rem]'>

      </div>
      </Layout>
    </div>
  );
};

export default Manage_Employee;
