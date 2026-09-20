/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, User, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth'; 

export const LoginPage = () => {
    const [fields, setFields] = useState({ agent_name: 'intern_bob', pass: '', department: 'general', clearance: 1 }); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/v1/auth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: fields.agent_name,
                    department: fields.department,
                    clearance: Number(fields.clearance)
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                const msg = typeof data.detail === 'object' 
                    ? (data.detail.msg || JSON.stringify(data.detail)) 
                    : (data.detail || "Authentication Failed");
                
                setError(msg);
                return;
            }

            // 1. SAVE TO GLOBAL CONTEXT
            login({ 
                user_id: data.user_id, 
                department: data.department,
                clearance: data.clearance,
                token: data.access_token 
            });

            // 2. SAVE TO LOCALSTORAGE
            localStorage.setItem("access_token", data.access_token);
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("department", data.department);
            localStorage.setItem("clearance", String(data.clearance));

            // 3. Navigate to Chat
            navigate('/chat');

        } catch (err) {
            setError("Connection Error: Is the FastAPI server running on port 8000?");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-zinc-950 -m-4 md:-m-8 font-sansflex">
            <form onSubmit={handleLogin} className="bg-zinc-900/40 backdrop-blur-xl p-10 rounded-3xl border border-white/10 w-full max-w-md space-y-6 shadow-2xl">
                <div className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        <Shield className="text-[#814AC8]" size={40} />
                    </div>
                    <h1 className="text-2xl text-white uppercase tracking-wider font-medium">Identity Portal</h1>
                    <p className="text-zinc-500 text-sm">Verify your credentials to access the AI Gateway</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded-lg text-center animate-in fade-in duration-300">
                        {String(error)}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-3 top-3 text-zinc-500" size={18} />
                        <input 
                            required
                            type="text"
                            placeholder="Username / Subject ID"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-[#814AC8] transition-all"
                            value={fields.agent_name}
                            onChange={e => setFields({...fields, agent_name: e.target.value})}
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-zinc-500" size={18} />
                        <select
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-[#814AC8] transition-all"
                            value={fields.department}
                            onChange={e => {
                                const dept = e.target.value;
                                const clearanceMap = { general: 1, engineering: 2, finance: 3, admin: 5 };
                                setFields({
                                    ...fields, 
                                    department: dept, 
                                    clearance: clearanceMap[dept] || 1
                                });
                            }}
                        >
                            <option value="general">Role: General (Clearance 1)</option>
                            <option value="engineering">Role: Engineering (Clearance 2)</option>
                            <option value="finance">Role: Finance (Clearance 3)</option>
                            <option value="admin">Role: Executive Admin (Clearance 5)</option>
                        </select>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading}
                    className='flex justify-center w-full cursor-pointer text-white bg-[#814AC8] hover:bg-[#935ce2] transition-all font-sansflex rounded-full px-6 py-4 disabled:bg-zinc-800'
                >
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin" size={20} />
                            <span>Verifying...</span>
                        </div>
                    ) : "Sign In to Gateway"}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;