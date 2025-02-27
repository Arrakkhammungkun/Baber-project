import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

import axios from "axios";
import { useNavigate } from 'react-router-dom';
import LayoutAdmin from './components/LayoutAdmin';
const Managment = () => {
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate(); 

  const handleNavigation = (path) => {
    navigate(path); // นำทางไปยังเส้นทางที่ได้รับเป็นพารามิเตอร์
  };

  useEffect(() => {
    axios
      .get(`${apiUrl}/services/`)
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
      });
  }, [services]);

  useEffect(() => {   
    axios.get(`${apiUrl}/employee/`)
      .then((response) => {

        setEmployees(response.data);
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);


  const handleStatusService = (serviceId) => {
    if (!serviceId) {
      console.error("Invalid service ID");
      return;
    }
  
    axios
      .patch(`${apiUrl}/services/${serviceId}/toggle-status/`)
      .then((response) => {
        const updatedService = response.data;
        
        setServices((prevServices) => {
          return prevServices.map((service) =>
            service.id === serviceId
              ? { ...service, status: updatedService.status }
              : service
          );
        });
  
        console.log("Updated services:", updatedService); // Debug ค่า status ใหม่
      })
      .catch((error) => {
        console.error("Error updating service status:", error);
      });
  };
  
  const handleStatusChange = (employeeId, newStatus) => {
    if (!employeeId) {
      console.error("Invalid employee ID");
      return;
    }
  
    axios.patch(`${apiUrl}/employee/${employeeId}/`, { status: newStatus })
      .then((response) => {

  
        // อัปเดตสถานะใน state ทันที
        const updatedEmployee = response.data;
        setEmployees((prevEmployees) =>
          prevEmployees.map((employee) =>
            employee.id === updatedEmployee.id
              ? { ...employee, status: updatedEmployee.status }
              : employee
          )
        );
      })
      .catch((error) => {
        console.error('Error updating employee status:', error);
      });
  };
  
  

  const calculateAge = (dob) => {
    const birthDate = new Date(dob); 
    const today = new Date(); 
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth(); 

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--; 
    }

    return age;
  };

  return (
    <div>
      <LayoutAdmin>
        <div className="container mt-24 mx-auto">
          <header className="mb-2 text-start">
            <h1 className="text-2xl font-bold text-gray-800 p-2 ml-20 uppercase">
              managment
            </h1>
          </header>
          <div className="flex justify-between gap-4">
            {/* Barber Section */}
      
              <div className=" w-5/6 mr-2">
                <h1 className="text-xl font-bold text-gray-800 p-2 capitalize">
                  Barber
                </h1>
                <hr className="bg-black border-black text-black border px-2 mb-5" />
                {employees.map((employee, index) => (
                  <div 
                    key={index} 
                    className="bg-black relative shadow-md rounded-lg border mb-2 p-2 h-auto flex flex-col sm:flex-row transition duration-300 hover:-translate-y-3 hover:shadow-lg cursor-pointer "
                  >
                    <div className="bg-cover bg-center h-[150px] sm:h-[200px] sm:w-[150px] md:h-[150px] md:w-[120px] rounded-lg" 
                      style={{ backgroundImage: `url(${employee.employee_image_url})` }}></div>
                    <div className="text-md text-white flex-1 px-4 mt-4 sm:mt-0 sm:pl-4">
                      <p className="font-bold text-xl">Name : {`${employee.first_name} ${employee.last_name}`}</p>
                      <p className="mt-1">NickName : {employee.nickname}</p>
                      <p className="mt-1">Gender : {employee.gender}</p>
                      <p className="mt-1">Age : {calculateAge(employee.dob)} years</p>
                      <div className="flex items-center gap-1">
                        <p>Position:</p>
                        <p className={`${employee.status === "Active" ? "text-green-500" : ""} 
                                      ${employee.status === "Inactive" ? "text-red-500" : ""}`}>
                          {employee.status}
                        </p>
                      </div>
                    </div>
                    {/* ปุ่มเปิดปิด */}
                    <div className="absolute bottom-2 left-2 right-2 flex justify-end gap-2">
                      {employee.status === "Inactive" ? (
                        <button  
                          className=" bg-[#CC2F22] text-white   px-4 py-1 text-sm rounded-md hover:bg-red-900 transition duration-300"
                          onClick={() => handleStatusChange(employee.id, 'Active')}
                        >
                          Offline
                        </button>
                      ) : (
                        <button 
                          className="bg-[#00BA9A] text-white  px-4 py-1 text-sm rounded-md  hover:bg-green-900 transition duration-300"
                          onClick={() => handleStatusChange(employee.id, 'Inactive')}
                        >
                          Online
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>


            {/* Service Section */}
            <div className=" w-2/5">
              <h1 className="text-xl font-bold text-gray-800 p-2 capitalize">
                service
              </h1>
              <hr className="bg-black border-black text-black border px-2 mb-5" />
              <div className="flex flex-col">
              {services.map((service, index) => (
                  <div key={index} className="flex mb-4">
                    <div className="bg-[#242529] text-white px-6 py-2 mr-10 rounded-md w-full">
                      {service.name}
                    </div>
                    <div className="flex w-full gap-1">
                      {/* ปุ่มเปิด (จางถ้าสถานะเป็น Active) */}
                      <button
                        onClick={() => handleStatusService(service.id)}
                        className={`uppercase rounded-md transition-all duration-500 w-full  border-1 shadow-md border-black ${
                          service.status === "Inactive"
                            ? "bg-[#7cb4ab] text-white opacity-50 hover:bg-green-700 hover:scale-105"
                            : "bg-[#00BA9A] text-white  shadow-lg cursor-not-allowed"
                        }`}
                        disabled={service.status === "Active"}
                      >
                        Open
                      </button>

                      {/* ปุ่มปิด (จางถ้าสถานะเป็น Inactive) */}
                      <button
                        onClick={() => handleStatusService(service.id)}
                        className={`uppercase rounded-md transition-all duration-500 w-full border-1 shadow-md border-black ${
                          service.status === "Active"
                            ? "bg-[#705f5d] text-white opacity-50 hover:bg-red-700 hover:scale-105"
                            : "bg-[#CC2F22] text-white  shadow-lg cursor-not-allowed"
                        }`}
                        disabled={service.status === "Inactive"}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ))}


                <div className="flex justify-center mb-4 shadow-lg mt-10">
                  <button onClick={() => handleNavigation('/admin/manage/employees')} className="bg-[#242529] text-white uppercase px-6 py-2 rounded-md hover:bg-gray-700 transition duration-300 w-full">
                    managment barber
                  </button>
                </div>
                <div className="flex justify-center shadow-lg">
                  <button onClick={() => handleNavigation('/admin/addservices')} className="bg-[#242529] text-white uppercase px-6 py-2 rounded-md hover:bg-gray-700 transition duration-300 w-full">
                    managment service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-20">

        </div>
      </LayoutAdmin>
    </div>
  );
};

export default Managment;
