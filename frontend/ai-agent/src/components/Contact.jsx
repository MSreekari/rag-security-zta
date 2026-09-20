import React from 'react'
import { motion } from 'framer-motion'
// Only import what we know works
import { ArrowRight } from 'lucide-react' 

const Contact = () => {
  const githubUrl = "https://github.com/MSreekari/secure-data-retrieval-ai-agent-zero-trust-architecture"; 

  return (
    <section id="contact" className='relative py-24 bg-black overflow-hidden flex flex-col items-center justify-center min-h-[50vh]'>
        
        <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#814AC8]/10 rounded-full blur-[100px]"></div>
        </div>

        <motion.main 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className='relative z-10 flex flex-col items-center gap-6 text-center px-6 max-w-4xl'
        >
            <span className='text-white text-xs font-medium px-4 py-1.5 rounded-full border border-zinc-700 bg-zinc-900/50 hover:border-[#814AC8] transition-colors duration-300 cursor-default uppercase tracking-widest'>
                Collaborate
            </span>

            <h1 className='text-white text-5xl md:text-7xl font-sansflex font-medium tracking-tight leading-tight'>
                Explore the <br />
                <span className='text-zinc-500'>Security Framework.</span>
            </h1>

            <p className='text-zinc-400 text-lg md:text-xl font-sansflex max-w-2xl leading-relaxed'>
                Interested in the technical implementation? View the full source code, 
                documentation, and system architecture on GitHub.
            </p>

            <motion.a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className='mt-4 flex items-center gap-3 cursor-pointer text-white bg-[#814AC8] hover:bg-white transition-all duration-300 hover:text-black rounded-lg px-8 py-4 text-lg font-semibold shadow-xl shadow-purple-500/10'
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                Connect on GitHub
            </motion.a>
        </motion.main>
    </section>
  )
}

export default Contact