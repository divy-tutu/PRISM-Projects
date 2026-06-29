import { Link } from 'react-router-dom';
import { Mail, Calendar, AlertCircle, Package, CheckCircle } from 'lucide-react';
import { AuthGuard } from '../components/auth/AuthGuard';
import { ItemCard } from '../components/items/ItemCard';
import { ItemCardSkeleton } from '../components/ui/Skeleton';
import { useAuth } from '../contexts/AuthContext';
import { useUserItems } from '../hooks/useItems';
import { formatDate } from '../lib/utils';

function StatBox({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm text-center">
      <div className={`h-10 w-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  const { items, loading } = useUserItems(user?.uid);

  const lostItems = items.filter((i) => i.type === 'lost');
  const foundItems = items.filter((i) => i.type === 'found');
  const resolvedItems = items.filter((i) => i.status === 'resolved');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Profile card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex items-start gap-5">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name}
              className="h-20 w-20 rounded-2xl object-cover shadow-md"
            />
          ) : (
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
              {user?.name[0]}
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <Mail className="h-3.5 w-3.5" />
              {user?.email}
            </div>
            {user?.createdAt && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mt-1">
                <Calendar className="h-3 w-3" />
                Member since {formatDate(user.createdAt)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatBox
          icon={AlertCircle}
          label="Lost Reported"
          value={lostItems.length}
          color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
        />
        <StatBox
          icon={Package}
          label="Found Reported"
          value={foundItems.length}
          color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <StatBox
          icon={CheckCircle}
          label="Recovered"
          value={resolvedItems.length}
          color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
        />
      </div>

      {/* Recent activity */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
          <Link
            to="/my-posts"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <ItemCardSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No activity yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.slice(0, 4).map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function Profile() {
  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Profile</h1>
        <ProfileContent />
      </div>
    </AuthGuard>
  );
}
