import React from 'react'
import { motion } from 'framer-motion';

const services = [
    {
        category : "Agent Identity", 
        title : "Real-Time Authentication Control", 
        description : "Ensure every AI agent is verified before access, using strong identity validation and role assignment mechanisms.", 
        tags : ["Secure Login", "Identity Verification", "Role Mapping"]
    }, 
    {
        category : "Access Governance", 
        title : "Policy-Based Authorization Engine", 
        description : "Define and enforce granular policies that control which resources each agent can access based on assigned roles.", 
        tags : ["Role Enforcement", "Policy Rules", "Access Control"]
    }, 
    {
        category : "Threat Monitoring", 
        title : "Continuous Risk & Activity Tracking", 
        description : "Monitor every interaction in real time, detect unusual behavior, and calculate dynamic risk scores for each request.", 
        tags : ["Risk Scoring", "Activity Logs", "Anomaly Detection"]
    }, 
    {
        category : "Enforcement Layer", 
        title : "Secure Policy Enforcement Gateway", 
        description : "Act as a central control point that validates, authorizes, and securely routes every AI agent request across the system.", 
        tags : ["Request Validation", "Decision Enforcement", "Secure Routing"]
    }
]; 
const Services = () => {
  return (
    <section id = "services" className='scroll-mt-20 flex flex-col min-h-screen items-center justify-center gap-4'>
        <span className='text-white font-medium px-4 py-1.5 rounded-full border border-zinc-700 bg-zinc-900/50 hover:border-indigo-500 hover:text-white transition-colors duration-300 cursor-default'>Our Services</span>
        <div className='max-w-6xl text-center space-y-4'>
            <h1 className='text-white font-sansflex text-5xl tracking-tight leading-tight'>Policy-driven security for <br />
                <span className='text-white font-sansflex text-5xl bg-clip-text'>authenticated, authorized, and monitored AI access</span>
            </h1>
        </div>
        <div className="flex flex-col gap-24 py-20 px-6 w-full max-w-7xl mx-auto">
    {services.map((service, index) => (
        <motion.div 
            key={index}
            initial={{ opacity: 0, y: 50 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24 w-full`}
        >
            <div className="w-full md:w-1/2 bg-zinc-900 border border-zinc-800 rounded-2xl h-80 flex items-center justify-center text-zinc-600">
                {service.category} Visual
            </div>

            <div className="w-full md:w-1/2 flex flex-col items-start text-left gap-4">
                <span className="text-xs font-sansflex text-indigo-400 uppercase tracking-widest">
                    {service.category}
                </span>
      
                <h2 className="text-4xl font-sansflex text-white font-medium leading-tight">
                    {service.title}
                </h2>

                <p className="text-xl font-sansflex text-zinc-400 leading-relaxed">
                    {service.description}
                </p>
      
                <div className="flex flex-wrap gap-2 mt-2">
                    {service.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 text-xs font-sansflex text-zinc-400 border border-zinc-700 rounded-full bg-zinc-800/50">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    ))}
</div>
    </section>
  )
}

export default Services