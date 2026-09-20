import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldAlert, Activity, Maximize2, Minimize2 } from 'lucide-react';

const SecuritySidebar = ({ riskScore, riskHistory }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div 
            style={{ width: isExpanded ? '450px' : '320px', transition: '0.3s' }}
            className="h-full border-l border-white/10 bg-zinc-900 p-6 flex flex-col gap-6"
        >
            {/* EXPAND BUTTON */}
            <div className="flex justify-between items-center">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Monitor</span>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 bg-zinc-800 rounded text-white"
                >
                    {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
            </div>

            {/* RISK SCORE BOX - FORCED VISIBILITY */}
            <div className="bg-black rounded-2xl border border-white/10 p-8 flex flex-col items-center">
                <h3 className="text-[10px] text-zinc-500 mb-2 uppercase font-bold">Risk Score</h3>
                <span className={`text-7xl font-black font-mono ${riskScore >= 70 ? 'text-red-500' : 'text-indigo-400'}`}>
                    {riskScore}%
                </span>
            </div>

            {/* GRAPH */}
            <div className={`bg-zinc-950 rounded-xl p-2 border border-white/5 ${isExpanded ? 'flex-1' : 'h-40'}`}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={riskHistory}>
                        <XAxis dataKey="time" hide />
                        <YAxis domain={[0, 100]} hide />
                        <Area type="monotone" dataKey="score" stroke="#818cf8" fill="#818cf8" fillOpacity={0.2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-auto p-3 bg-white/5 rounded text-[10px] font-bold text-green-500 border border-green-500/20">
                GATEWAY STATUS: ACTIVE
            </div>
        </div>
    );
};

export default SecuritySidebar;