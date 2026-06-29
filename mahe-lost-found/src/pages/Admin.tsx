import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Trash2, CheckCircle, ExternalLink, Package } from 'lucide-react';
import { AuthGuard } from '../components/auth/AuthGuard';
import { Badge } from '../components/ui/Badge';
import { CategoryBadge } from '../components/items/CategoryBadge';
import { Button } from '../components/ui/Button';
import { ItemFilters, DEFAULT_FILTERS } from '../components/items/ItemFilters';
import { Skeleton } from '../components/ui/Skeleton';
import { useItems, useItemActions } from '../hooks/useItems';
import { useAuth } from '../contexts/AuthContext';
import { formatRelative } from '../lib/utils';
import type { ItemFilters as Filters } from '../types';

function AdminRow({ item }: { item: import('../types').Item }) {
  const { deleteItem, markResolved } = useItemActions();

  const handleDelete = async () => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await deleteItem(item);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-4 flex gap-4 items-start">
      <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        {item.imageURL ? (
          <img src={item.imageURL} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Package className="h-6 w-6 text-gray-300 dark:text-gray-600" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link
            to={`/item/${item.id}`}
            className="font-medium text-gray-900 dark:text-white text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1"
          >
            {item.title}
          </Link>
          <Link to={`/item/${item.id}`} className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-1.5">
          <Badge variant={item.type}>{item.type}</Badge>
          <Badge variant={item.status}>{item.status}</Badge>
          <CategoryBadge category={item.category} />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          by {item.ownerName} · {item.location} · {formatRelative(item.createdAt)}
        </p>
      </div>

      <div className="flex gap-1.5 shrink-0">
        {item.status !== 'resolved' && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => markResolved(item.id)}
            className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 p-1.5"
            title="Mark resolved"
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 p-1.5"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function AdminContent() {
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const { items, loading } = useItems(filters, 100);

  if (!isAdmin) {
    return (
      <div className="text-center py-16">
        <Shield className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Access Denied</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          You don't have admin privileges.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-200">
        Admin panel — all items visible. Changes are permanent.
      </div>

      <ItemFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No items match your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">{items.length} items</p>
          {items.map((item) => <AdminRow key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
}

export function Admin() {
  return (
    <AuthGuard>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Moderate reported items</p>
          </div>
        </div>

        <AdminContent />
      </div>
    </AuthGuard>
  );
}
