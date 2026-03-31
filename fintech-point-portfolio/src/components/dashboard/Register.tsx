import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, User, Mail, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import { apiService } from '../../Service/api';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await apiService.post('/api/auth/register', formData);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-card/80 backdrop-blur-xl border border-border p-10 rounded-[2.5rem] shadow-2xl shadow-primary/5"
      >
        <button 
          onClick={() => window.location.href = '/login'}
          className="flex items-center gap-2 text-secondary hover:text-white transition-colors mb-8 text-sm font-bold uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto mb-6 shadow-xl shadow-primary/20">FP</div>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-secondary">Join the Fintech Point management team</p>
        </div>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 border border-green-500/20 text-green-500 p-8 rounded-3xl text-center"
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Success!</h3>
            <p className="text-sm opacity-80">Your account has been created. Redirecting to login...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary px-2">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                  <input 
                    type="text" 
                    required
                    value={formData.username} 
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-primary transition-colors font-medium"
                    placeholder="johndoe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-secondary px-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                  <input 
                    type="email" 
                    required
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-primary transition-colors font-medium"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-secondary px-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                <input 
                  type="password" 
                  required
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-background border border-border rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-primary transition-colors font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-secondary px-2">Account Role</label>
              <div className="grid grid-cols-2 gap-4">
                {['user', 'admin'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({...formData, role})}
                    className={`py-4 rounded-2xl border transition-all font-bold capitalize ${
                      formData.role === role 
                        ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5' 
                        : 'bg-background border-border text-secondary hover:border-white/20'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-5 bg-primary hover:bg-primary/90 text-white font-black rounded-2xl transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
