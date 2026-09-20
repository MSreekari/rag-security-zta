import React from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    /* We add bg-zinc-950/50 and backdrop-blur to make it look premium */
    <header className='w-full fixed top-0 left-0 z-[100] bg-zinc-950/80 backdrop-blur-md border-b border-white/10'>
        <div className='max-w-[1440px] mx-auto flex items-center justify-between px-6 py-4 md:px-12'>
            
            {/* Logo Section */}
            <div className='flex items-center gap-2'>
                <h1 className='text-3xl md:text-4xl text-white font-sansflex tracking-tight'>
                    Secure AI
                </h1>
            </div>

            {/* Navigation Links */}
            <nav className='hidden md:flex items-center gap-8 text-white text-sm font-sansflex'>
                <a href="#home" className='hover:text-[#814AC8] transition-colors'>Home</a>
                <a href="#services" className='hover:text-[#814AC8] transition-colors'>Services</a>
                <a href="#process" className='hover:text-[#814AC8] transition-colors'>Process</a>
                <a href="#contact" className='hover:text-[#814AC8] transition-colors'>Contact Us</a>
                
                <button 
                    onClick={() => navigate('/login')} 
                    className="bg-[#814AC8] hover:bg-[#915ad9] cursor-pointer text-white px-6 py-2.5 rounded-lg font-sansflex transition-all shadow-lg shadow-purple-500/20"
                >
                    Get Started
                </button>         
            </nav>
        </div>
    </header>
  )
}

export default Navbar