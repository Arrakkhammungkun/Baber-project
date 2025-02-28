import { createContext, useState, useContext,useEffect } from 'react';
import PropTypes from 'prop-types'; 


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminToken,setadminToken]=useState(true);
  const [admin, setadmin] = useState(null);
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedAdminToken = localStorage.getItem('adminToken');
      const storedUser = localStorage.getItem('user');
      const storedAdmin = localStorage.getItem('admin');

      if (storedToken) setToken(storedToken);
      if (storedAdminToken) setadminToken(storedAdminToken);
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedAdmin) setadmin(JSON.parse(storedAdmin));
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('token', tokenData);
    localStorage.setItem('user', JSON.stringify(userData)); 
  };
  const login_Admin =(adminData,adminTokenData)=>{
    setadminToken(adminTokenData);
    setadmin(adminData);

    localStorage.setItem('admin', JSON.stringify(adminData));
    localStorage.setItem('adminToken', adminTokenData);
  };
  const fetchUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token'); 
    localStorage.removeItem('user'); 


  };
  const logoutAdmin = () => {
;   setadmin(null);
    setadminToken(null);
    localStorage.removeItem('adminToken'); 
    localStorage.removeItem('admin')

  };
  const logout = () => {
    logoutUser();
    logoutAdmin(); 


  };
  return (
    <AuthContext.Provider value={{ user, token, login, logout,loading,login_Admin,adminToken,admin,logoutAdmin,fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};


AuthProvider.propTypes = {
  children: PropTypes.node.isRequired, 
};


export const useAuth = () => useContext(AuthContext);
