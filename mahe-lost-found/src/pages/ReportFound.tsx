import { AuthGuard } from '../components/auth/AuthGuard';
import { ReportForm } from '../components/forms/ReportForm';
import { CheckCircle } from 'lucide-react';

export function ReportFound() {
  return (
    <AuthGuard>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Report Found Item</h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            Good on you for picking it up! Describe what you found so the owner can identify it.
            They'll reach out to arrange a return.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <ReportForm type="found" />
        </div>
      </div>
    </AuthGuard>
  );
}
