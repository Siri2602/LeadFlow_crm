import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ParticleBackground from '../components/ui/ParticleBackground';
import toast from 'react-hot-toast';
import { RiEyeLine, RiEyeOffLine, RiSparklingLine } from 'react-icons/ri';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] grid-bg flex items-center justify-center p-4 relative overflow-hidden">
      <ParticleBackground count={60} />

      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#8b5cf6]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#58a6ff]/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center gap-2 mb-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#58a6ff] to-[#58a6ff] flex items-center justify-center ">
              <span className="text-white font-bold text-sm">LF</span>
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-[#e6edf3] mb-1">LeadFlow CRM <span className="gradient-text">AI</span></h1>
          <p className="text-[#8b949e] text-sm">Turn Conversations Into Clients</p>
        </div>

        {/* Card */}
        <div className="glass-bright border border-[#21262d] rounded-2xl p-8 ">
          <h2 className="text-xl font-semibold text-[#e6edf3] mb-6">Sign in to your workspace</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-[#8b949e] mb-1.5 block uppercase tracking-widest">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field w-full px-4 py-3 rounded-xl text-sm"
                placeholder="admin@leadflow.ai"
                required
              />
            </div>

            <div>
              <label className="text-xs text-[#8b949e] mb-1.5 block uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field w-full px-4 py-3 pr-11 rounded-xl text-sm"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#e6edf3]/30 hover:text-[#e6edf3]/60 cursor-pointer"
                >
                  {showPass ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl font-semibold text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <motion.div className="w-5 h-5 border-2 border-[#0d1117] border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
              ) : (
                <>
                  <RiSparklingLine size={16} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#e6edf3]/30 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#58a6ff] hover:underline">Create one</Link>
          </p>
        </div>

        {/* Demo hint */}
        <div className="mt-4 text-center text-xs text-[#e6edf3]/20">
          Demo: register any account or use your own credentials
        </div>
      </motion.div>
    </div>
  );
}
