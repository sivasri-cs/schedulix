import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '../components/common/Sidebar';
import GlassCard from '../components/common/GlassCard';
import NeonButton from '../components/common/NeonButton';
import { getUsers, getStats, getAnnouncements, createAnnouncement, deleteAnnouncement } from '../services/adminService';
import { HiUsers, HiChartBar, HiMegaphone, HiTrash, HiPlus } from 'react-icons/hi2';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    getUsers().then(r => setUsers(r.data.users || [])).catch(() => {});
    getStats().then(r => setStats(r.data || {})).catch(() => {});
    getAnnouncements().then(r => setAnnouncements(r.data.announcements || [])).catch(() => {});
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const r = await createAnnouncement({ title, content });
      setAnnouncements([r.data.announcement, ...announcements]);
      setTitle(''); setContent(''); setShowForm(false);
      toast.success('Announcement created');
    } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    try { await deleteAnnouncement(id); setAnnouncements(a => a.filter(x => x._id !== id)); toast.success('Deleted'); } catch { toast.error('Failed'); }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin <span className="gradient-text">Dashboard</span></h1>
          <p className="text-white/40">Manage users, monitor activity, and create announcements</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.totalUsers || users.length, icon: HiUsers, color: 'text-neon-cyan' },
            { label: 'Total Simulations', value: stats.totalSimulations || 0, icon: HiChartBar, color: 'text-neon-purple' },
            { label: 'Active Today', value: stats.activeToday || 0, icon: HiUsers, color: 'text-neon-green' },
            { label: 'Announcements', value: announcements.length, icon: HiMegaphone, color: 'text-neon-orange' },
          ].map((s, i) => (
            <GlassCard key={i} className="!p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-white/30">{s.label}</div>
                </div>
                <s.icon className={`w-8 h-8 ${s.color} opacity-30`} />
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Users */}
          <GlassCard hover={false}>
            <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider mb-4">Users ({users.length})</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {users.map((u, i) => (
                <div key={u._id || i} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-magenta flex items-center justify-center text-xs font-bold text-white">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{u.name}</div>
                    <div className="text-xs text-white/30 truncate">{u.email}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-neon-orange/10 text-neon-orange' : 'bg-white/5 text-white/40'}`}>{u.role}</span>
                </div>
              ))}
              {users.length === 0 && <p className="text-white/30 text-center py-8">No users yet</p>}
            </div>
          </GlassCard>

          {/* Announcements */}
          <GlassCard hover={false}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neon-cyan uppercase tracking-wider">Announcements</h3>
              <button onClick={() => setShowForm(!showForm)} className="text-neon-cyan hover:text-white"><HiPlus size={20} /></button>
            </div>
            {showForm && (
              <form onSubmit={handleCreate} className="space-y-3 mb-4 p-4 rounded-xl bg-white/3 border border-white/5">
                <input value={title} onChange={e => setTitle(e.target.value)} className="input-glow" placeholder="Title" required />
                <textarea value={content} onChange={e => setContent(e.target.value)} className="input-glow !h-20 resize-none" placeholder="Content" required />
                <NeonButton type="submit" variant="fill" className="!py-2 !text-xs">Publish</NeonButton>
              </form>
            )}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {announcements.map((a, i) => (
                <div key={a._id || i} className="p-3 rounded-xl bg-white/3 border border-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white">{a.title}</h4>
                      <p className="text-xs text-white/40 mt-1">{a.content}</p>
                      <p className="text-[10px] text-white/20 mt-2">{new Date(a.createdAt).toLocaleString()}</p>
                    </div>
                    <button onClick={() => handleDelete(a._id)} className="text-white/20 hover:text-neon-pink"><HiTrash size={14} /></button>
                  </div>
                </div>
              ))}
              {announcements.length === 0 && <p className="text-white/30 text-center py-8">No announcements</p>}
            </div>
          </GlassCard>
        </div>
      </div>
    </MainLayout>
  );
}
