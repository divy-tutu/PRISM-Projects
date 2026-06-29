import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Package, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ItemCard } from '../components/items/ItemCard';
import { ItemCardSkeleton } from '../components/ui/Skeleton';
import { useItems, useStats } from '../hooks/useItems';
import { useAuth } from '../contexts/AuthContext';

function StatCard({
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
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
      <div className={`h-12 w-12 rounded-xl ${color} flex items-center justify-center mb-3`}>
        <Icon className="h-6 w-6" />
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Report your item',
    desc: 'Lost something? Found something? Post it here with details and a photo.',
    emoji: '📝',
  },
  {
    step: '02',
    title: 'Browse & search',
    desc: 'Search by category, location, or keyword to find your item quickly.',
    emoji: '🔍',
  },
  {
    step: '03',
    title: 'Connect & recover',
    desc: 'Submit a claim with details. The reporter will verify and return your item.',
    emoji: '🤝',
  },
];

export function Home() {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  const stats = useStats();
  const { items: recentItems, loading } = useItems({}, 6);

  const handleReportLost = () => {
    if (!user) signInWithGoogle();
    else navigate('/report/lost');
  };

  const handleReportFound = () => {
    if (!user) signInWithGoogle();
    else navigate('/report/found');
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoLTZ2LTZoNnptMC0zMHY2aC02VjRoNnptLTMwIDMwdjZINFYzNGg2em0wLTMwdjZINFY0aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/20 text-white/90 text-sm font-medium backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              MAHE Lost &amp; Found Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Never lose your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                belongings again.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
              One centralized platform for MAHE students and staff to report lost items,
              find returned ones, and connect with the campus community.
            </p>

            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <Button
                size="lg"
                onClick={handleReportLost}
                className="bg-white text-indigo-700 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all"
              >
                <AlertCircle className="h-5 w-5" />
                Report Lost Item
              </Button>
              <Button
                size="lg"
                onClick={handleReportFound}
                className="bg-white/15 text-white border border-white/30 hover:bg-white/25 backdrop-blur-sm"
              >
                <CheckCircle className="h-5 w-5" />
                Report Found Item
              </Button>
              <Button
                size="lg"
                onClick={() => navigate('/browse')}
                variant="ghost"
                className="text-white hover:bg-white/15"
              >
                <Search className="h-5 w-5" />
                Browse Items
              </Button>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 64" fill="none" className="w-full text-gray-50 dark:text-gray-950">
            <path d="M0 32C240 64 480 0 720 32C960 64 1200 0 1440 32V64H0V32Z" fill="currentColor" />
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 py-12">
        {/* Stats */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={AlertCircle}
              label="Lost Items Reported"
              value={stats.lostCount}
              color="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            />
            <StatCard
              icon={Package}
              label="Found Items Reported"
              value={stats.foundCount}
              color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
            />
            <StatCard
              icon={CheckCircle}
              label="Items Recovered"
              value={stats.resolvedCount}
              color="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
            />
          </div>
        </section>

        {/* Recent listings */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Listings</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Latest lost and found reports from campus
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/browse')}>
              View all <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <ItemCardSkeleton key={i} />
              ))}
            </div>
          ) : recentItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500 dark:text-gray-400">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No items reported yet</p>
              <p className="text-sm">Be the first to report a lost or found item!</p>
            </div>
          )}
        </section>

        {/* How it works */}
        <section className="pb-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">How It Works</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Three simple steps to recover your belongings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900" />

            {HOW_IT_WORKS.map(({ step, title, desc, emoji }) => (
              <div key={step} className="relative text-center p-6">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">
                  {emoji}
                </div>
                <span className="text-xs font-bold text-indigo-500 dark:text-indigo-400 tracking-widest">
                  STEP {step}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-1 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            {!user && (
              <Button size="lg" onClick={signInWithGoogle} className="shadow-md">
                Get Started — Sign in with Google
              </Button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
