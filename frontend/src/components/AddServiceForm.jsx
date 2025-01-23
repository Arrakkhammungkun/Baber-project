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
            });
           
        } catch (error) {
            console.error('Error adding service:', error);
            
        }
    };

    return (
        <div>
            <h2>Add New Service</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={service.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={service.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        name="price"
                        value={service.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Duration (in minutes):</label>
                    <input
                        type="number"
                        name="duration"
                        value={service.duration}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Image URL:</label>
                    <input
                        type="text"
                        name="imageUrl"
                        value={service.imageUrl}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Add Service</button>
            </form>
        </div>
    );
}

export default AddServiceForm;
