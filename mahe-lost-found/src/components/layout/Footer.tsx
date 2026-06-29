import { Link } from 'react-router-dom';
import { BookOpen, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-sm">
              MAHE Lost &amp; Found
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/browse"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Browse Items
            </Link>
            <Link
              to="/report/lost"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Report Lost
            </Link>
            <Link
              to="/report/found"
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              Report Found
            </Link>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-red-400" /> for MAHE students
          </p>
        </div>
      </div>
    </footer>
  );
}
