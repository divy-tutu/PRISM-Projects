import { cn } from '../../lib/utils';
import { CATEGORY_MAP } from '../../lib/constants';
import type { Category } from '../../types';

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const meta = CATEGORY_MAP[category];
  if (!meta) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        meta.color,
        className
      )}
    >
      {meta.emoji} {meta.label}
    </span>
  );
}
