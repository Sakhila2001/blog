import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
  return (
    
      <div class="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <img onClick={()=>navigate('/')} alt="logo" class="w-32 sm:w-44 cursor-pointer" src={assets.logo} />
      <butto onClick={()=>navigate('/admin')} className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-5 py-2.5'>Login
      <img src={assets.arrow} className='w-3' alt='arrow' />
      </butto>
     
      </div>
   
  );
}

export default Navbar;
