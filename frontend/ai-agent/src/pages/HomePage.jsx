import React from 'react';
import Navbar from '../components/Navbar';
import { Home } from '../components/Home';
import Services from '../components/Services';
import Process from '../components/Process';
import About from '../components/Aboutus';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-[#0D0D0D] to-[#000000]'>
        <Navbar />
        <div className='pt-20'>
          <Home /> 
        </div>
        <div className='pt-20'>
          <About /> 
        </div>
        <div className='pt-20'>
          <Services /> 
        </div>
        <div className='pt-30'>
          <Process /> 
        </div>
        <div className='pt-30'>
          <Contact /> 
        </div>
        <div className='pt-30'>
          <Footer /> 
        </div>
    </div>
  );
};

export default HomePage;