import React from "react";
import { assets } from "../../assets/assets";
import { Outlet} from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar.jsx";
import { useAppContext } from "../../context/AppContext.jsx";
import axios from "axios";

const Layout = () => {
  // const navigate = useNavigate();

  // const { setToken } = useAppContext(); // get setToken from context

  // const logout = () => {
  //   // Clear token from context and localStorage
  //   setToken(null);
  //   localStorage.removeItem("token");
  //   // Remove default axios header if you are using axios
  //   axios.defaults.headers.common["Authorization"] = null;

  //   navigate("/"); // redirect to home/login
  // };

  const {axios, setToken, navigate} = useAppContext();
  const logout = ()=>{
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = null;
    setToken(null)
    navigate('/')

  }
  return (
    <>
      <div className="flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200">
        <img
          src={assets.logo}
          alt="Logo"
          className="w-32 sm:w-40 cursor-pointer"
          onClick={() => navigate("/")}
        />
        <button
          onClick={logout}
          className="text-sm px-8 py-2 bg-primary text-white
        rounded-full cursor-pointer"
        >
          Logout
        </button>
      </div>
      <div className="flex h-[calc(100vh-70px)]">
        <Sidebar />
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
