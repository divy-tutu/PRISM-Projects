import type { Category } from '../types';

export interface CategoryMeta {
  value: Category;
  label: string;
  emoji: string;
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { value: 'id-card', label: 'ID Card', emoji: '🪪', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  { value: 'wallet', label: 'Wallet', emoji: '👛', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
  { value: 'keys', label: 'Keys', emoji: '🔑', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
  { value: 'laptop', label: 'Laptop', emoji: '💻', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
  { value: 'phone', label: 'Phone', emoji: '📱', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  { value: 'tablet', label: 'Tablet', emoji: '📟', color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
  { value: 'earphones', label: 'Earphones', emoji: '🎧', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  { value: 'watch', label: 'Watch', emoji: '⌚', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
  { value: 'calculator', label: 'Calculator', emoji: '🧮', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  { value: 'water-bottle', label: 'Water Bottle', emoji: '💧', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300' },
  { value: 'bag', label: 'Bag', emoji: '🎒', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
  { value: 'umbrella', label: 'Umbrella', emoji: '☂️', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' },
  { value: 'clothing', label: 'Clothing', emoji: '👕', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
  { value: 'lab-equipment', label: 'Lab Equipment', emoji: '🧪', color: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300' },
  { value: 'books', label: 'Books', emoji: '📚', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  { value: 'electronics', label: 'Electronics', emoji: '🔌', color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
  { value: 'other', label: 'Other', emoji: '📦', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
];

export const CATEGORY_MAP: Record<Category, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c])
) as Record<Category, CategoryMeta>;

export const MAHE_EMAIL_DOMAIN = '@learner.manipal.edu';

export const ADMIN_EMAILS = ['admin@manipal.edu'];

export const LOCATIONS = [
  'MIT Library',
  'MIT Main Block',
  'KMC Library',
  'Food Court',
  'Manipal Institute of Technology',
  'Kasturba Medical College',
  'Department of Computer Science',
  'Marena Sports Complex',
  'End Point Bus Stop',
  'Tiger Circle',
  'Syndicate Circle',
  'Parking Area',
  'Student Plaza',
  'Boys Hostel Block A',
  'Girls Hostel',
  'Innovation Centre',
  'Other',
];
