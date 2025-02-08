import { useEffect, useState } from "react";
const apiUrl =import.meta.env.VITE_API_URL;
import Layout from './components/Layout';
import axios from "axios";


const Booking_Management = () => {
  const [services, setServices] = useState([]);


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
  const handleEdit = (service) => {
   
    console.log(service); 
    
  };
  const handleDelete = async (serviceId) => {
    try {
      const response = await axios.delete(`${apiUrl}/services/${serviceId}/`);
      console.log("Service deleted:", response.data);
      
      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== serviceId)
      );
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("เกิดข้อผิดพลาดในการลบบริการ");
    }
  };
  

  
  return (
    <div >
        <Layout>

      <div className='container mt-24 mx-auto '>

       
        <header className="mb-2 text-start ">
          <h1 className="text-2xl font-bold text-gray-800 p-2 ml-20">BOOKING MANAGEMENT</h1>
          <h1 className="text-xl font-bold text-gray-800 p-2 ">Queue</h1>
          <hr className='bg-black border-black text-black border-2 px-2' />
        </header>
        <div className="max-w-full mx-auto bg-white shadow-md rounded-lg p-4">
          
              <>
              <div className='flex items-start'>
                  <div
                      
                      className="flex justify-between items-center bg-black w-full  p-1 mb-2 rounded-l-full rounded-br-[1200rem] shadow-sm"
                      >
                          <di  className="flex items-center">
                            <div className="flex items-center">
                                <img src="/src/img/14.jpg" alt="User" className="rounded-full w-32 h-32 object-cover"/>
                            </div>
                            <div>
                                <p className="text-white font-medium p-3">Name : <a>Touch Naahee</a></p>
                                <p className="text-white font-medium p-3">Service : <a>Spa</a></p>
                            </div>
                            <div>
                                <p className="text-white font-medium p-3">Time : <a>10 : 30 AM.</a></p>
                                <p className="text-white font-medium p-3">Barber : <a>ARCHIE WILLIAMS</a></p>
                            </div>
                          </di>
                      </div> 
                        <div className="flex space-x-3 h-full md:ml-16 ml-8 pt-0 items-start justify-between whitespace-nowrap text-center">
                            <p className="md:px-12 px-5  w-full h-full py-4 bg-white text-[#00BA9A] text-sm rounded-md border border-[#00BA9A] select-none">
                               In progress
                            </p>
                            <button className="md:px-14 px-5  w-full h-full py-4 bg-[#00BA9A] text-white text-sm rounded-md hover:bg-[#00A085]">
                                complete
                            </button>
                            <button className="md:px-14 px-5 w-full h-full py-4  bg-red-500 text-white text-sm rounded-md hover:bg-red-600">
                              Delete
                            </button>
                        </div>
                  </div>
              </>

          
          
        </div>
      </div>
      <div className='my-[20rem]'>

      </div>
      </Layout>
    </div>
  );
};

export default Booking_Management;
