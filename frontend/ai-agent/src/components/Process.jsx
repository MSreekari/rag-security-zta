import React from 'react'
import { motion } from 'framer-motion'

const steps = [
    {
        id: "Step 1",
        title: "Request Interception",
        desc: "Every incoming AI agent request is intercepted at the gateway to initiate strict validation and enforce Zero Trust principles.",
        visual: "Request Capture"
    },
    {
        id: "Step 2",
        title: "Identity Validation",
        desc: "The system authenticates agent credentials and verifies identity using secure mechanisms before allowing any interaction.",
        visual: "JWT Decoding"
    },
    {
        id: "Step 3",
        title: "Policy Authorization",
        desc: "Access policies are evaluated against agent roles, ensuring only authorized actions are permitted based on security rules.",
        visual: "Policy Matching"
    },
    {
        id: "Step 4",
        title: "Risk Monitoring",
        desc: "Each request is continuously assessed for risk, logging activity and detecting anomalies to mitigate potential threats.",
        visual: "Risk Analysis"
    }
];

const Process = () => {
    return (
        <section id="process" className='py-24 bg-black overflow-hidden scroll-mt-20'>
            <div className='max-w-7xl mx-auto px-6 flex flex-col items-center'>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='flex flex-col items-center text-center gap-6 mb-16'
                >
                    <span className='text-white font-medium px-4 py-1.5 rounded-full border border-zinc-700 bg-zinc-900/50 hover:border-[#814AC8] transition-colors duration-300 cursor-default'>
                        Our Process
                    </span>
                    
                    <h1 className='text-white font-sansflex text-4xl md:text-6xl tracking-tight leading-tight max-w-4xl'>
                        A Secure, Intelligent <br />
                        <span className='text-white'>Access Control Process</span>
                    </h1>
                    
                    <p className='text-white text-lg md:text-xl max-w-2xl font-sansflex font-light'>
                        Every AI request is intercepted, validated, authorized, and continuously monitored to ensure complete security and control.
                    </p>
                </motion.div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 w-full'>
                    {steps.map((step, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className='bg-zinc-900/40 border border-white/5 rounded-2xl p-8 flex flex-col gap-6 hover:border-white/10 transition-colors group'
                        >
                            <div className='inline-flex items-center justify-center bg-zinc-800 border border-white/10 px-3 py-1 rounded-md text-[10px] font-sansflex font-medium text-zinc-400 uppercase w-fit'>
                                {step.id}
                            </div>

                            <div className='space-y-3'>
                                <h2 className='text-2xl md:text-3xl font-sansflex text-white tracking-tight'>
                                    {step.title}
                                </h2>
                                <p className='text-zinc-400 leading-relaxed font-sansflex font-light'>
                                    {step.desc}
                                </p>
                            </div>

                            {/* Visual Placeholder Box (Matches screenshots) */}
                            <div className='mt-4 h-48 w-full bg-black/40 border border-white/5 rounded-xl flex flex-col items-center justify-center gap-3 group-hover:bg-black/60 transition-colors overflow-hidden relative'>
                                {/* Subtle Glow Effect */}
                                <div className='absolute inset-0 bg-[#814AC8]/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity'></div>
                                
                                <div className='w-12 h-12 rounded-full border border-[#814AC8]/30 flex items-center justify-center text-[#814AC8] animate-pulse'>
                                    <div className='w-2 h-2 bg-[#814AC8] rounded-full'></div>
                                </div>
                                <span className='text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold'>
                                    {step.visual}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Process;