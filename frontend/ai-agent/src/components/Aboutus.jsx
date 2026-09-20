import React from 'react'
import { motion } from 'framer-motion'

const About = () => {
  return (
    <section id="about" className='relative py-24 bg-black overflow-hidden flex flex-col items-center justify-center min-h-[60vh]'>
        
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#814AC8]/5 rounded-full blur-[120px]"></div>
        </div>

        <motion.main 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className='relative z-10 flex flex-col items-center gap-6 text-center px-6 max-w-5xl'
        >
            {/* "About Us" Badge */}
            <span className='text-white text-xs font-sansflex font-medium px-4 py-1.5 rounded-full border border-zinc-700 bg-zinc-900/50 hover:border-[#814AC8] transition-colors duration-300 cursor-default uppercase tracking-widest'>
                About the Gateway
            </span>

            {/* Project Title */}
            <h1 className='text-white text-5xl md:text-7xl font-sansflex font-medium tracking-tight leading-tight'>
                Securing the Future of <br />
                <span className='text-white'>AI-Driven Operations.</span>
            </h1>

            {/* Project Subtitle */}
            <p className='text-zinc-400 text-lg md:text-2xl font-sansflex max-w-3xl leading-relaxed'>
                Secure AI Retrieval acts as a robust policy enforcement layer, 
                ensuring that AI agents operate within strictly defined security 
                boundaries through real-time validation.
            </p>
        </motion.main>
    </section>
  )
}

export default About