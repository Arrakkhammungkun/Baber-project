import { useEffect, useState } from "react";
const apiUrl = import.meta.env.VITE_API_URL;

import axios from "axios";
import EditServiceForm from "./components/EditServiceForm";
import AddServiceForm from "./components/AddServiceForm";
import Swal from "sweetalert2";
import LayoutAdmin from "./components/LayoutAdmin";
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
      title: "ยืนยันการดำเนินการ?",
      text: "คุณต้องการยืนยันการดำเนินการนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `${apiUrl}/services/${serviceId}/`
          );
          console.log("Service deleted:", response.data);
          await Swal.fire(
            "ยืนยันแล้ว!",
            "การดำเนินการเสร็จสมบูรณ์!",
            "success"
          );
          setServices((prevServices) =>
            prevServices.filter((service) => service.id !== serviceId)
          );
        } catch (error) {
          console.error("Error deleting service:", error);

          Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบบริการได้!", "error");
        }
      } else if (result.isDismissed) {
        // หากผู้ใช้กด "ยกเลิก" ให้แสดงข้อความยกเลิก
        Swal.fire("ยกเลิกแล้ว!", "การดำเนินการถูกยกเลิก!", "error");
      }
    });
  };

  const handleAddService = (newService) => {
    setServices((prevServices) => [...prevServices, newService]); // อัปเดต state ทันทีที่เพิ่ม
  };

  return (
    <div>
      <LayoutAdmin>
        <EditServiceForm
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          serviceId={selectedServiceId}
          onUpdateService={handleUpdateService}
        />

        <AddServiceForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddService={handleAddService}
        />
        <div className="container mt-24 mx-auto ">
          <header className="mb-2 text-start ">
            <h1 className="text-2xl font-bold text-gray-800 p-2 ml-20">
              MANAGEMENT
            </h1>
            <h1 className="text-xl font-bold text-gray-800 p-2 ml-10">
              Service
            </h1>
            <hr className="bg-black border-black text-black border-2 px-2" />
          </header>
          <div className="max-w-full mx-auto bg-white shadow-md rounded-lg p-4">
            <table className="w-full  border-gray-600 text-white mt-3 border-separate border-spacing-y-2">
              <thead className="relative -top-3">
                <tr className="bg-white text-black">
                  <th className="border-[3px] p-[15px] l border-black border-r-0">
                    No.
                  </th>
                  <th className="border-[3px] p-2 border-black border-r-0">
                    Name
                  </th>
                  <th className="border-[3px] p-2 border-black border-r-0">
                    Desciption
                  </th>
                  <th className="border-[3px] p-2 border-black border-r-0">
                    Price
                  </th>
                  <th className="border-[3px] p-2 border-black border-r-0">
                    Time
                  </th>
                  <th className="border-[3px] p-2 border-black border-r-0">
                    IMG
                  </th>
                  <th className="border-[3px] p-2  border-black">Manage</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr
                    key={service.id}
                    className="bg-black text-white text-center rounded-lg "
                  >
                    <td className="border-[1px] rounded-l-md border-black p-2">
                      {index + 1}
                    </td>
                    <td className="border-[1px] p-2 border-black">
                      {service.name}
                    </td>
                    <td className="border-[1px] p-2 border-black break-words whitespace-pre-line max-w-[200px]">
                      {service.description}
                    </td>
                    <td className="border-[1px] p-2 border-black">
                      {service.price} บาท
                    </td>
                    <td className="border-[1px] p-2 border-black">
                      {service.duration} นาที
                    </td>
                    <td className="w-10 h-10">
                      <img src={service.image_url} alt="" />
                    </td>

                    <td className="border-[1px] p-2  gap-2 justify-center border-black  rounded-r-md">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="p-2"
                          onClick={() => handleEdit(service.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            viewBox="0 0 512 512"
                          >
                            <path
                              fill="#ffffff"
                              d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-2 rounded text-white"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            viewBox="0 0 448 512"
                          >
                            <path
                              fill="#db1414"
                              d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mt-3 mb-8">
              <button
                onClick={handleAdd}
                className="md:px-[8.6rem] px-8 py-4 bg-black text-white text-sm rounded-md hover:bg-[#464545]"
              >
                +Add
              </button>
            </div>
          </div>
        </div>
        <div className="my-[18rem]"></div>
      </LayoutAdmin>
    </div>
  );
};

export default Add_Service;
