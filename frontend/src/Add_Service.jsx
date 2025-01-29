import { useEffect, useState } from "react";
const apiUrl =import.meta.env.VITE_API_URL;
import Layout from './components/Layout';
import axios from "axios";
import EditServiceForm from "./components/EditServiceForm";
import AddServiceForm from "./components/AddServiceForm";
import Swal from 'sweetalert2';
const Add_Service = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
        <EditServiceForm
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            serviceId={selectedServiceId}
            onUpdateService={handleUpdateService}
             />

        <AddServiceForm isOpen={isModalOpen} onClose={handleCloseModal} onAddService={handleAddService}/>
       <div className='container mt-24 mx-auto '>

       
      <header className="mb-2 text-start ">
        <h1 className="text-2xl font-bold text-gray-800 p-2 ml-20">MANAGEMENT</h1>
        <h1 className="text-xl font-bold text-gray-800 p-2 ml-10">Service</h1>
        <hr className='bg-black border-black text-black border-2 px-2' />
      </header>
      <div className="max-w-full mx-auto bg-white shadow-md rounded-lg p-4">
      {services.map((service) => (
    <div key={service.id}> 
        <div className='flex items-start'>
            <div className="flex justify-between items-center bg-black w-full px-4 p-1 mb-2 rounded-md shadow-sm">
                <div>
                    <p className="text-white font-medium bg-black p-3">{service.name}</p>
                </div>
            </div> 
            <div className="flex space-x-2 h-full md:ml-16 ml-8 pt-0 items-start">
                <button
                    className="md:px-16 px-5 w-full h-full py-4 bg-[#545454] text-white text-sm rounded-md hover:bg-[#464545]"
                    onClick={() => handleEdit(service.id)} 
                >
                    Edit
                </button>
                <button
                    className="md:px-14 px-5 py-4 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                    onClick={() => handleDelete(service.id)}  
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
))}

        <div className='flex justify-end mt-3 mb-8'>
            <button onClick={handleAdd} className="md:px-[8.6rem] px-8 py-4 bg-black text-white text-sm rounded-md hover:bg-[#464545]">
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

export default Add_Service;
