
import Layout from './components/Layout';
const Add_Service = () => {
  const services = [
    { id: 1, name: "บริการตัดผมชาย" },
    { id: 2, name: "บริการสระ-ไดร์ผม" },
    { id: 3, name: "บริการย้อมผม" },
    { id: 4, name: "บริการย้อมผม" },
    { id: 5, name: "บริการย้อมผม" },
    { id: 6, name: "บริการย้อมผม" },
  ];

  return (
    <div >
        <Layout>

       <div className='container mt-24 mx-auto '>

       
      <header className="mb-2 text-start ">
        <h1 className="text-2xl font-bold text-gray-800 p-2 ml-20">MANAGEMENT</h1>
        <h1 className="text-xl font-bold text-gray-800 p-2 ml-10">Service</h1>
        <hr className='bg-black border-black text-black border-2 px-2' />
      </header>
      <div className="max-w-full mx-auto bg-white shadow-md rounded-lg p-4">
        {services.map((service) => (
            <>
            <div className='flex items-start'>
                <div
                    key={service.id}
                    className="flex justify-between items-center bg-black w-full px-4 p-1 mb-2 rounded-md shadow-sm"
                    >
                        <div>
                            <p className="text-white font-medium bg-black p-3  ">{service.name}</p>
                        </div>
                    </div> 
                    <div className="flex space-x-2 h-full md:ml-16 ml-8 pt-0 items-start">
                        <button className="md:px-16 px-5    w-full h-full py-4 bg-[#545454] text-white text-sm rounded-md hover:bg-[#464545]">
                            Edit
                        </button>
                        <button className="md:px-14 px-5 py-4 bg-red-500 text-white text-sm rounded-md hover:bg-red-600">
                            Delete
                        </button>
                    </div>
                </div>
            </>

        ))}
        <div className='flex justify-end mt-3 mb-8'>
            <button className="md:px-[8.6rem] px-8 py-4 bg-black text-white text-sm rounded-md hover:bg-[#464545]">
                +Add
            </button>
        </div>
      </div>
      </div>
      <div className='my-[20rem]'>

      </div>
      </Layout>
    </div>
  );
};

export default Add_Service;
