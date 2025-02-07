import { useState,useEffect } from 'react';
import axios from 'axios';
const apiUrl =import.meta.env.VITE_API_URL;
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
function EditServiceForm({ isOpen, onClose, serviceId, onUpdateService}) {
    const [service, setService] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
        imageUrl: ''
    });
    useEffect(() => {
        if (isOpen && serviceId) {
            // document.body.style.overflow = 'hidden';
            axios
                .get(`${apiUrl}/services/${serviceId}/`)
                .then((response) => {
                    setService({
                        name: response.data.name,
                        description: response.data.description,
                        price: response.data.price,
                        duration: response.data.duration,
                        imageUrl: response.data.image_url,
                    });
                })
                .catch((error) => {
                    console.error('Error fetching service data:', error);
                });
            return ()=>{
                // document.body.style.overflow ='auto';

            };
        }
    }, [isOpen, serviceId,]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setService({
            ...service,
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
              const response = await axios.put(`${apiUrl}/services/${serviceId}/`, {
                name: service.name,
                description: service.description,
                price: parseInt(service.price),
                duration: parseInt(service.duration),
                image_url: service.imageUrl,
              });
              // แสดงข้อความว่าการอัปเดตสำเร็จ
              await Swal.fire('ยืนยันแล้ว!', 'การอัปเดตบริการเสร็จสมบูรณ์!', 'success');
      
              onUpdateService(response.data); // อัปเดตข้อมูลใน component หลัก
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
        <div className=" fixed inset-0 z-50 h-screen w-full flex justify-center items-center ">
            
            
            <form onSubmit={handleSubmit}>
                <div className=' bg-black/70 flex justify-center items-center h-screen w-screen relative'>
                    
                    <div className='relative mx-auto p-2'>
                        <h2 className='text-2xl text-white mb-2 '>Edit Service</h2>
                        <div className='border-2 border-white p-2 rounded-xl mb-2 w-[250px] md:w-[350px] sm:w-[250px] xl:[400px] 2xl:[500px] max-w-[500px] sm:max-w-lg md:max-w-xl lg:max-w-2xl'>
<<<<<<< Updated upstream
                            <div className='bg-[#D9D9D9] rounded-xl p-2 '>
=======
                            <div className='bg-[#D9D9D9] rounded-xl p-2'>
                            
>>>>>>> Stashed changes

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="absolute top-1 right-1 text-gray-600 hover:text-gray-800 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className='h-8 w-8' viewBox="0 0 512 512"><path fill="#ffffff" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
                                </button>
                                <div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="New Name"
                                    className="w-full bg-black text-white rounded-xl p-2 mb-2 placeholder-white placeholder:text-center"
                                    value={service.name}
                                    onChange={handleChange}
                                    required
                                />
                                </div>  
                        
                                <div>
                                    
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="Price"
                                        className="w-full bg-black text-white rounded-xl p-2 mb-2 placeholder-white placeholder:text-center"
                                        value={service.price}
                                        onChange={handleChange}
                                        min={1}
                                        required
                                    />
                                </div>
                                <div>
                                    
                                    <input
                                        type="number"
                                        name="duration"
                                        placeholder="Time"
                                        className="w-full bg-black text-white rounded-xl p-2 mb-2 placeholder-white placeholder:text-center"
                                        value={service.duration}
                                        onChange={handleChange}
                                        min={1}
                                        required
                                    />
                                </div>
                                <div>
                                    
                                    <textarea
                                        name="description"
                                        placeholder="Details"
                                        className="w-full bg-black text-white rounded-xl p-2 mb-2 placeholder-white placeholder:text-center"
                                        value={service.description}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="imageUrl"
                                        placeholder="Picture"
                                        className="w-full bg-black text-white rounded-xl p-2 mb-2 placeholder-white placeholder:text-center"
                                        value={service.imageUrl}
                                        onChange={handleChange}
                                    />
                                </div>
                                
                                
                            </div>
                        </div>
                        <div></div>
                        <div className='flex justify-end'>
                                <button type="submit" className='bg-[#00BA9A] text-white rounded-xl py-2 px-4 inline-block jastify-center hover:bg-[#0A836E] transition duration-300'>Save</button>
                        </div>
                    </div>
                </div>
                
                
            </form>
        </div>
    );
}
EditServiceForm.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    serviceId: PropTypes.string,
    onUpdateService: PropTypes.func, // onClose ต้องเป็น function และต้องส่งมาเสมอ
  };
export default EditServiceForm;
