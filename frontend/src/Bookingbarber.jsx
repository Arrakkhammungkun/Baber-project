import { useEffect, useState } from "react";
const apiUrl =import.meta.env.VITE_API_URL;
import Layout from './components/Layout';
import axios from "axios";

const Bookingbarber = () => {
    const [services, setServices] = useState([]);
  
  
    useEffect(() => {
      // ดึงข้อมูลจาก API
      axios
        .get(`${apiUrl}/services/`)
        .then((response) => {
          setServices(response.data); // เก็บข้อมูลใน state
        })
        .catch((error) => {
          console.error("Error fetching services:", error);
        });
    }, []);
  
  
    return (
        <div >
          <Layout>
  
            <div className='container mt-24 mx-auto '>
    
            
                <header className="mb-2 text-start">
                    <h1 className="text-2xl font-bold text-gray-800 p-2 ml-20 uppercase">Booking</h1>
                </header>
                <div className='ml-10 w-[800px]'>
                    <h1 className="text-xl font-bold text-gray-800 p-2  capitalize">barber</h1>
                    <hr className='bg-black border-black text-black border px-2 mb-5' />
                    <div className="bg-black shadow-md rounded-lg border p-4 h-[250px] flex">
                        <div className="bg-[url('/src/img/14.jpg')] bg-cover bg-center h-full w-[200px] rounded-lg"></div>
                        <div className="text-xl text-white font-bol p-2 ">
                            <p className="uppercase">ARCHIE WILLIAMS</p>
                            <p className="mt-3">A versatile master of haircuts of any complexity who loves his job.</p>
                            <p className="mt-3">Position : Barber</p>
                            <p className="mt-3">Experience : 11 years</p>
                        </div>
                    </div>
                </div> 
            </div>
        
        
        </Layout>
      </div>
    );
  };
  
  export default Bookingbarber;