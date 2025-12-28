import { LucideIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {Icon && (
        <div className="w-16 h-16 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-zinc-600" />
        </div>
      )}
      <h3 className="text-lg font-medium text-zinc-300 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-zinc-500 mb-6 text-center max-w-md">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
