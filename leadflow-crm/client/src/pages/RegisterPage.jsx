import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ParticleBackground from '../components/ui/ParticleBackground';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to LeadFlow CRM.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] grid-bg flex items-center justify-center p-4 relative overflow-hidden">
      <ParticleBackground count={50} />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-[#58a6ff]/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#e6edf3] mb-1">Create Account</h1>
          <p className="text-[#8b949e] text-sm">Join LeadFlow CRM today</p>
        </div>

        <div className="glass-bright border border-[#21262d] rounded-2xl p-8 glow-blue">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
              { key: 'email', label: 'Email', type: 'email', placeholder: 'john@company.com' },
              { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs text-[#8b949e] mb-1.5 block uppercase tracking-widest">{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  className="input-field w-full px-4 py-3 rounded-xl text-sm"
                  placeholder={placeholder}
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl font-semibold text-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-[#e6edf3]/30 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#58a6ff] hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
