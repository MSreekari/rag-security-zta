import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl text-white font-sansflex font-medium tracking-tight">Secure AI</h1>
          </div>
          <p className="text-zinc-400 font-sansflex text-sm leading-relaxed max-w-xs">
            Secure AI - Intercepting, Validating, and Monitoring AI Agents for a safer digital ecosystem.
          </p>
        </div>

        <div className="space-y-6 font-sansflex">
          <h4 className="text-white font-sansflex font-medium text-sm uppercase tracking-widest">Architecture</h4>
          <ul className="space-y-3 text-zinc-400 text-sm">
            <li><a href="#services" className="hover:text-white transition-colors">Identity Layer</a></li>
            <li><a href="#process" className="hover:text-white transition-colors">Enforcement PEP</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">Risk Engine</a></li>
            <li><a href="#" className="hover:text-white transition-colors">JWT Standards</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Regex Logic</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-sansflex font-medium text-sm uppercase tracking-widest">Navigation</h4>
          <ul className="space-y-3 text-zinc-400 text-sm">
            <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
            <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
            <li><a href="/login" className="hover:text-white transition-colors">Gateway Login</a></li>
            <li><a href="#contact" className="hover:text-white transition-colors">GitHub</a></li>
          </ul>
        </div>

        <div className="space-y-6">
          <h4 className="text-white font-sansflex font-medium text-sm uppercase tracking-widest">Dev Channels</h4>
          <ul className="space-y-3 text-zinc-400 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
            <li><a href="#" className="hover:text-white transition-colors">GitHub Repo</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Research Paper</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-zinc-500 text-xs">
          © {new Date().getFullYear()} Secure AI Retrieval.
        </p>
      </div>
    </footer>
  )
}

export default Footer