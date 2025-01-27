import { useState } from 'react';
import axios from 'axios';
const apiUrl =import.meta.env.VITE_API_URL;


function AddServiceForm() {
    const [service, setService] = useState({
        name: '',
        description: '',
        price: '',
        duration: '',
        imageUrl: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setService({
            ...service,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${apiUrl}/services/`, {
                name: service.name,
                description: service.description,
                price: parseInt(service.price),
                duration: parseInt(service.duration),
                image_url: service.imageUrl
            });

            console.log('Service added:', response.data);
            alert('Service added successfully!');

            // Reset form fields
            setService({
                name: '',
                description: '',
                price: '',
                duration: '',
                imageUrl: '',
                select: '',
            });
           
        } catch (error) {
            console.error('Error adding service:', error);
            
        }
    };

    return (
        <div className="h-screen w-full flex justify-center items-center ">
            
            
            <form onSubmit={handleSubmit}>
                <div className='bg-black/70 flex justify-center items-center h-screen w-screen '>
                    
                    <div className='relative mx-auto p-2'>
                        <h2 className='text-2xl text-white mb-2'>Edit Service</h2>
                        <div className='border-2 border-white p-2 rounded-xl mb-2 w-[250px] md:w-[350px] sm:w-[250px] xl:[400px] 2xl:[500px] max-w-[500px] sm:max-w-lg md:max-w-xl lg:max-w-2xl'>
                            <div className='bg-[#D9D9D9] rounded-xl p-2'>
                            <div className="grid">
                                <select
                                    name="select"
                                    id="name_service"
                                    className="col-start-1 row-start-1 appearance-auto w-full bg-black text-white rounded-xl p-2 mb-2 text-center"
                                    defaultValue=""
                                >
                                    <option value="" disabled hidden >
                                        Select
                                    </option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                </select>
                            </div>

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

export default AddServiceForm;
