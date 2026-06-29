import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { CategoryBadge } from '../components/items/CategoryBadge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import { ClaimModal } from '../components/forms/ClaimModal';
import { useItem, useItemActions } from '../hooks/useItems';
import { useClaims } from '../hooks/useClaims';
import { useAuth } from '../contexts/AuthContext';
import { formatDate, formatRelative } from '../lib/utils';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1586769852044-692d6e3703f2?w=800&h=500&fit=crop&q=80';

export function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuth();
  const { item, loading } = useItem(id);
  const { claims } = useClaims(id);
  const { deleteItem, markResolved, uploading } = useItemActions();
  const [claimOpen, setClaimOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) return <DetailSkeleton />;
  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">Item not found.</p>
        <Link to="/browse" className="text-indigo-600 dark:text-indigo-400 text-sm mt-2 inline-block">
          Back to Browse
        </Link>
      </div>
    );
  }

  const isOwner = user?.uid === item.ownerId;
  const canClaim = user && !isOwner && item.status === 'open';
  const alreadyClaimed = claims.some((c) => c.claimerId === user?.uid);

  const handleDelete = async () => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    await deleteItem(item);
    navigate('/my-posts');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <Link
        to="/browse"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Image + actions */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 aspect-video">
            <img
              src={item.imageURL || PLACEHOLDER_IMAGE}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
            />
          </div>

          {/* Claim CTA */}
          {canClaim && (
            <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 rounded-2xl p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Is this yours?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                If you believe this item belongs to you, submit a claim with details to identify it.
              </p>
              {alreadyClaimed ? (
                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle className="h-4 w-4" /> You've already submitted a claim
                </div>
              ) : (
                <Button onClick={() => setClaimOpen(true)} className="w-full sm:w-auto">
                  <MessageSquare className="h-4 w-4" />
                  This might be mine
                </Button>
              )}
            </div>
          )}

          {/* Claims list (owner only) */}
          {isOwner && claims.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Claims ({claims.length})
              </h3>
              <div className="space-y-3">
                {claims.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {claim.claimerName}
                        </p>
                        <a
                          href={`mailto:${claim.claimerEmail}`}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          {claim.claimerEmail}
                        </a>
                      </div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          claim.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : claim.status === 'rejected'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{claim.message}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      {formatRelative(claim.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Details sidebar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={item.type}>{item.type === 'lost' ? '🔍 Lost' : '✅ Found'}</Badge>
              <Badge variant={item.status}>
                {item.status === 'open' ? 'Open' : item.status === 'claimed' ? 'Claimed' : '✓ Resolved'}
              </Badge>
              <CategoryBadge category={item.category} />
            </div>

            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug">
              {item.title}
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-5">
              {item.description}
            </p>

            <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                <span>{item.location}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                <span>{formatDate(item.date)}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                <span>Posted {formatRelative(item.createdAt)}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mt-4 space-y-2">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Reported by
              </p>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                  {item.ownerName[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.ownerName}</p>
                  {(isOwner || isAdmin) && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.ownerEmail}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Owner actions */}
          {(isOwner || isAdmin) && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-2">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                Manage
              </p>
              {item.status !== 'resolved' && (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => markResolved(item.id)}
                  loading={uploading}
                >
                  <CheckCircle className="h-4 w-4" /> Mark as Resolved
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/my-posts`)}
              >
                <Edit className="h-4 w-4" /> Edit in My Posts
              </Button>
              <Button variant="danger" className="w-full" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" /> Delete Item
              </Button>
            </div>
          )}
        </div>
      </div>

      {item && (
        <ClaimModal item={item} open={claimOpen} onClose={() => setClaimOpen(false)} />
      )}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <Skeleton className="h-4 w-28 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Skeleton className="aspect-video rounded-2xl" />
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
