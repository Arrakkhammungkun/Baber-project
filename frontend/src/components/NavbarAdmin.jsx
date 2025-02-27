import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const apiUrl_img = import.meta.env.VITE_API_IMG;

const NavbarAdmin = () => {
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { user, token, logout } = useAuth();
 
  const [isMenuOpen, setIsMenuOpen] = useState(false);  // เพิ่มสถานะใหม่สำหรับ hamburger menu


  const handleLogout = () => {
    logout();
    
  };
  
  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);  // สลับสถานะของเมนู
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false); // ซ่อน navbar เมื่อ scroll ลง
      } else {
        setIsVisible(true); // แสดง navbar เมื่อ scroll ขึ้น
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-black text-white z-50 p-4 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">STYLEX</div>

        {/* Navigation Links (For desktop) */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-6">
          <a href="/" className="hover:text-gray-300">
          Dashboard
          </a>
          <a href="/test_service" className="hover:text-gray-300">
          Managment
          </a>
          <a href="/about" className="hover:text-gray-300">
          Booking Management
          </a>
          <a href="/contact" className="hover:text-gray-300">
          EditService
          </a>
          <a href="/contact" className="hover:text-gray-300">
          Add_Service
          </a>
        </div>



        {/* Right Side (Profile or Login/Register) */}
        <div className="relative">
          {token ? (
            <div className="flex items-center space-x-4">
              <div className="cursor-pointer" onClick={handleMenuToggle}>
                {user && user.profile_image ? (
                  <img
                  src={`${apiUrl_img}${user.profile_image}`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full  shadow-md object-cover"
                  />
                ) : (
                  <div className="rounded-full w-10 h-10 flex justify-center items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 text-white"
                      viewBox="0 0 448 512"
                      fill="currentColor"
                    >
                      <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z" />
                    </svg>
                  </div>
                )}
              </div>


            </div>
          ) : (
            <>
              <div className="hidden md:flex  space-x-2">
              
              <Link
                to="/login"
                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
              >
                เข้าสู่ระบบ
              </Link>

            </div>

          {/* Hamburger button for smaller screens */}
              <button
                className="md:hidden block text-white focus:outline-none"
                onClick={handleMenuToggle}
              >
              <svg xmlns="http://www.w3.org/2000/svg" className='h-8 w-8' viewBox="0 0 448 512"><path fill="#ffffff" d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
              </button>
            </>

            
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 bg-white text-white w-64  transform  h-screen ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300`}
      >
        <div className="flex justify-between p-2 items-center">
          <button onClick={handleMenuToggle} className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-8 w-8 text-black ">
          
          <path 
          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
          </button>
          <div className='text-black p-2 text-2xl' >
            STYLEX
          </div>
        </div>



        <div className="flex flex-col items-center space-y-6 mt-2 h-full bg-white min-h-min ">

          <a href="/" className="text-black text-lg hover:text-gray-500">
            Dashboard
          </a>
          <a href="/" className="text-black text-lg hover:text-gray-500">
            Managment
          </a>
          <a href="/services" className="text-black text-lg hover:text-gray-300">
            Booking Management
          </a>
          <a href="/about" className="text-black text-lg hover:text-gray-300">
          Manage Employee
          </a>
          <a href="/contact" className="text-black text-lg hover:text-gray-300">
          Add Service
          </a>
          <a href="/contact" className="text-black text-lg hover:text-gray-300">
          EditService
          </a>
          {
            token &&(
              <a onClick={handleLogout} className="text-black text-lg  px-4 py-2 rounded-md  bg-red-500 hover:bg-red-600">
              ออกจากระบบ
            </a>
            )
          }

          {!token && (
            <div className="flex flex-col items-center  space-y-4 mt-6">
              <Link
                to="/login"
                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
