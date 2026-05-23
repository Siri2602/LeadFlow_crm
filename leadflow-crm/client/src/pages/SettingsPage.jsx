import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#e6edf3]">Settings</h1>
        <p className="text-[#8b949e] text-sm">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card rounded-2xl p-6 space-y-4">
        <h2 className="text-sm font-semibold text-[#e6edf3] uppercase tracking-widest">Profile</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-[#8b949e] mb-1.5 block">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className="input-field w-full px-4 py-2.5 rounded-xl text-sm" />
          </div>
          <div>
            <label className="text-xs text-[#8b949e] mb-1.5 block">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} className="input-field w-full px-4 py-2.5 rounded-xl text-sm" />
          </div>
        </div>
        <button onClick={() => toast.success('Profile updated!')} className="btn-primary px-6 py-2.5 rounded-xl text-sm font-medium cursor-pointer">
          Save Changes
        </button>
      </motion.div>

      {/* Account info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-semibold text-[#e6edf3] uppercase tracking-widest">Account</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-[#21262d]">
            <span className="text-[#8b949e]">Role</span>
            <span className="text-[#58a6ff] capitalize">{user?.role}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[#21262d]">
            <span className="text-[#8b949e]">User ID</span>
            <span className="text-[#e6edf3]/30 font-mono text-xs">{user?._id}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[#8b949e]">Plan</span>
            <span className="text-[#3fb950]">Free Tier</span>
          </div>
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card border-[#f85149]/20 rounded-2xl p-6 space-y-3">
        <h2 className="text-sm font-semibold text-[#f85149] uppercase tracking-widest">Danger Zone</h2>
        <p className="text-[#8b949e] text-sm">These actions are irreversible. Please be careful.</p>
        <button onClick={() => toast.error('Account deletion not available in demo')} className="btn-danger px-6 py-2.5 rounded-xl text-sm cursor-pointer">
          Delete Account
        </button>
      </motion.div>
    </div>
  );
}
