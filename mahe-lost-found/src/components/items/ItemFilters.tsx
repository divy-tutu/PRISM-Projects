import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { CATEGORIES } from '../../lib/constants';
import { LOCATIONS } from '../../lib/constants';
import type { ItemFilters as Filters } from '../../types';

interface ItemFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

const DEFAULT_FILTERS: Filters = {
  search: '',
  category: '',
  type: '',
  status: '',
  location: '',
};

export function ItemFilters({ filters, onChange, onReset }: ItemFiltersProps) {
  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.type ||
    filters.status ||
    filters.location;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <Input
          type="search"
          placeholder="Search items…"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="pl-10"
        />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap gap-2 items-center">
        <SlidersHorizontal className="h-4 w-4 text-gray-400" />

        <Select
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value as Filters['type'] })}
          className="w-auto min-w-28 py-1.5 text-xs"
        >
          <option value="">All types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </Select>

        <Select
          value={filters.category}
          onChange={(e) =>
            onChange({ ...filters, category: e.target.value as Filters['category'] })
          }
          className="w-auto min-w-36 py-1.5 text-xs"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.emoji} {cat.label}
            </option>
          ))}
        </Select>

        <Select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value as Filters['status'] })}
          className="w-auto min-w-28 py-1.5 text-xs"
        >
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="claimed">Claimed</option>
          <option value="resolved">Resolved</option>
        </Select>

        <Select
          value={filters.location}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
          className="w-auto min-w-40 py-1.5 text-xs"
        >
          <option value="">All locations</option>
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="text-xs gap-1">
            <X className="h-3 w-3" /> Clear
          </Button>
        )}
      </div>
    </div>
  );
}

export { DEFAULT_FILTERS };
