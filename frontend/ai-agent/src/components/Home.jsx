import React from 'react'
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  return (
    <div id="home" className='relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-black'>
        
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#814AC8]/30 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:40px_40px]"></div>
        </div>

        <main className='relative z-10 flex flex-col items-center gap-6 text-center px-4'>
            <h1 className='text-white text-6xl font-sansflex font-medium max-w-4xl leading-tight'>Empowering AI Agents with <br />
            <span className='text-6xl font-sansflex font-medium text-white'>Secure, Context-Aware Access.</span>
            </h1>
            <p className='text-white text-2xl font-sansflex'>Every request is verified, every action is controlled, and every access is monitored.</p>
            <div className="flex flex-row items-center justify-center gap-4 mt-4">
              <button 
                onClick={() => navigate('/login')} 
                className='flex items-center gap-2 cursor-pointer text-white bg-[#814AC8] hover:bg-white transition-all hover:text-black rounded-lg px-6 py-3 font-medium'
              >
                Get Started 
                <ArrowUpRight size={20} />
              </button>
              <button 
                className='text-white font-medium cursor-pointer px-6 py-3 rounded-lg border border-zinc-700 bg-zinc-900/50 hover:border-[#814AC8] hover:bg-zinc-800 transition-all duration-300'
              >
                Our Process
              </button>
            </div>
        </main>
    </div>
  )
}