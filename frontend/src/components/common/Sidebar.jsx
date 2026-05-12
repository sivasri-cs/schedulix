import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HiCpuChip, HiCircleStack, HiLockClosed, HiServerStack, HiFolderOpen, HiAcademicCap, HiChartBar, HiCog6Tooth, HiArrowRightOnRectangle, HiShieldCheck, HiBars3, HiXMark, HiHome, HiQuestionMarkCircle } from 'react-icons/hi2';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiHome },
  { path: '/scheduling', label: 'Process Scheduling', icon: HiCpuChip },
  { path: '/memory', label: 'Memory Management', icon: HiCircleStack },
  { path: '/deadlock', label: 'Deadlock Detection', icon: HiLockClosed },
  { path: '/disk', label: 'Disk Scheduling', icon: HiServerStack },
  { path: '/filesystem', label: 'File System', icon: HiFolderOpen },
  { path: '/quiz', label: 'Quiz', icon: HiAcademicCap },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setCollapsed(!collapsed)} className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-lg text-neon-cyan">
        {collapsed ? <HiXMark size={24} /> : <HiBars3 size={24} />}
      </button>

      <AnimatePresence>
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} bg-osnova-surface/90 backdrop-blur-xl border-r border-white/5`}
        >
          {/* Logo */}
          <div className="p-5 border-b border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center font-bold text-osnova-bg text-lg flex-shrink-0">OS</div>
            {!collapsed && <div><h1 className="font-bold text-lg gradient-text">OSNova</h1><p className="text-[10px] text-white/30 uppercase tracking-widest">OS Simulator</p></div>}
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {navItems.map(item => (
              <NavLink key={item.path} to={item.path} className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-neon-cyan/10 text-neon-cyan shadow-neon-cyan/20' : 'text-white/50 hover:text-white hover:bg-white/5'}`
              }>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? 'bg-neon-orange/10 text-neon-orange' : 'text-white/50 hover:text-neon-orange hover:bg-white/5'}`
              }>
                <HiShieldCheck className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>Admin Panel</span>}
              </NavLink>
            )}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-white/5">
            {user ? (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-magenta flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  {!collapsed && <div className="truncate"><p className="text-sm font-medium truncate">{user.name}</p><p className="text-[10px] text-white/30">{user.role}</p></div>}
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-white/40 hover:text-neon-pink text-sm transition-colors w-full px-1">
                  <HiArrowRightOnRectangle className="w-5 h-5" />
                  {!collapsed && <span>Logout</span>}
                </button>
              </>
            ) : (
              <NavLink to="/login" className="flex items-center gap-2 text-neon-cyan hover:text-white text-sm transition-colors w-full px-1">
                <HiArrowRightOnRectangle className="w-5 h-5" />
                {!collapsed && <span>Sign In</span>}
              </NavLink>
            )}
          </div>

          {/* Collapse toggle (desktop) */}
          <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex absolute -right-3 top-1/2 w-6 h-6 rounded-full bg-osnova-surface border border-white/10 items-center justify-center text-white/40 hover:text-neon-cyan text-xs transition-colors">
            {collapsed ? '→' : '←'}
          </button>
        </motion.aside>
      </AnimatePresence>
    </>
  );
}

export function MainLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 lg:ml-64 p-6 relative z-10">{children}</main>
    </div>
  );
}
