// eslint-disable-next-line no-unused-vars
import React from 'react';
import NavbarAdmin from './NavbarAdmin';
import Footer from './Footer';

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarAdmin />
      
      <main className="flex-grow">
        {children} {/* เนื้อหาหลักจะถูกแทรกที่นี่ */}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
