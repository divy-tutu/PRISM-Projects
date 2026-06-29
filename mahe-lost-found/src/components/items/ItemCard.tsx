import { Link } from 'react-router-dom';
import { MapPin, Calendar, MessageSquare } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { CategoryBadge } from './CategoryBadge';
import type { Item } from '../../types';
import { formatDate } from '../../lib/utils';

interface ItemCardProps {
  item: Item;
}

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1586769852044-692d6e3703f2?w=400&h=300&fit=crop&q=80';

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link
      to={`/item/${item.id}`}
      className="group block rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={item.imageURL || PLACEHOLDER_IMAGE}
          alt={item.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
        />
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <Badge variant={item.type}>{item.type === 'lost' ? '🔍 Lost' : '✅ Found'}</Badge>
        </div>
        {item.status !== 'open' && (
          <div className="absolute top-2.5 right-2.5">
            <Badge variant={item.status}>
              {item.status === 'resolved' ? '✓ Resolved' : 'Claimed'}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {item.title}
          </h3>
        </div>

        <CategoryBadge category={item.category} />

        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{formatDate(item.date)}</span>
          </div>
          {(item.claimCount ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400">
              <MessageSquare className="h-3 w-3 shrink-0" />
              <span>{item.claimCount} claim{item.claimCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
