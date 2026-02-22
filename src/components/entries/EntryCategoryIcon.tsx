import { getCategoryIcon } from '@/utils/categoryIcons';

interface EntryCategoryIconProps {
  category: string;
  size?: string;
  className?: string;
}

export function EntryCategoryIcon({
  category,
  size = 'w-16 h-16',
  className = '',
}: EntryCategoryIconProps) {
  const Icon = getCategoryIcon(category);

  return (
    <div className={`${size} rounded-md bg-primary-light flex items-center justify-center shrink-0 ${className}`}>
      <Icon className="w-6 h-6 text-text-secondary" />
    </div>
  );
}
