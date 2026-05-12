import { motion } from 'framer-motion';

export default function NeonButton({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button', ...props }) {
  const variants = {
    primary: 'btn-neon',
    fill: 'btn-neon-fill',
    danger: 'btn-danger',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant] || variants.primary} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
