interface BadgeProps {
  variant?: 'draft' | 'active' | 'archived' | 'critical' | 'high' | 'medium' | 'low' | 'passed' | 'failed' | 'blocked' | 'skipped' | 'default';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium transition-all duration-200';

  const variantClasses = {
    // Status variants
    draft: 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50',
    active: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    archived: 'bg-zinc-700/30 text-zinc-500 border border-zinc-600/30',

    // Priority variants
    critical: 'bg-red-500/10 text-red-400 border border-red-500/20',
    high: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    low: 'bg-green-500/10 text-green-400 border border-green-500/20',

    // Result variants
    passed: 'bg-green-500/10 text-green-400 border border-green-500/20',
    failed: 'bg-red-500/10 text-red-400 border border-red-500/20',
    blocked: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    skipped: 'bg-zinc-700/30 text-zinc-400 border border-zinc-600/30',

    // Default
    default: 'bg-zinc-800/50 text-zinc-300 border border-zinc-700/50',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
