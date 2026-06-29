import { useState } from 'react';
import { Package } from 'lucide-react';
import { ItemCard } from '../components/items/ItemCard';
import { ItemFilters, DEFAULT_FILTERS } from '../components/items/ItemFilters';
import { ItemCardSkeleton } from '../components/ui/Skeleton';
import { useItems } from '../hooks/useItems';
import type { ItemFilters as Filters } from '../types';

export function Browse() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const { items, loading } = useItems(filters, 50);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Items</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Find your lost belongings or help return what you've found
        </p>
      </div>

      <div className="mb-6">
        <ItemFilters
          filters={filters}
          onChange={setFilters}
          onReset={() => setFilters(DEFAULT_FILTERS)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <ItemCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-500">
          <Package className="h-16 w-16 mb-4 opacity-40" />
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No items found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {items.length} item{items.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
