import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', hover = true, glow = '', ...props }) {
  const glowColors = {
    cyan: 'hover:shadow-neon-cyan hover:border-neon-cyan/20',
    purple: 'hover:shadow-neon-purple hover:border-neon-purple/20',
    green: 'hover:shadow-neon-green hover:border-neon-green/20',
    magenta: 'hover:shadow-neon-magenta hover:border-neon-magenta/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-card p-6 ${hover ? (glowColors[glow] || 'hover:shadow-neon-cyan hover:border-neon-cyan/20') : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
