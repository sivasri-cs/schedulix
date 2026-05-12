export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative">
        <div className={`${sizes[size]} border-2 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin`} />
        <div className={`${sizes[size]} border-2 border-neon-purple/10 border-b-neon-purple rounded-full animate-spin absolute inset-0`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      {text && <p className="text-sm text-white/50 animate-pulse">{text}</p>}
    </div>
  );
}
