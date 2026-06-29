import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, CheckCircle, Package, ExternalLink } from 'lucide-react';
import { AuthGuard } from '../components/auth/AuthGuard';
import { Badge } from '../components/ui/Badge';
import { CategoryBadge } from '../components/items/CategoryBadge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea, Select, FormField } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import { useUserItems, useItemActions } from '../hooks/useItems';
import { useAuth } from '../contexts/AuthContext';
import { LOCATIONS } from '../lib/constants';
import { formatDate, formatRelative } from '../lib/utils';
import type { Item } from '../types';

interface EditModalProps {
  item: Item;
  open: boolean;
  onClose: () => void;
}

function EditModal({ item, open, onClose }: EditModalProps) {
  const { updateItem } = useItemActions();
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [location, setLocation] = useState(item.location);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateItem(item.id, { title, description, location });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Item" maxWidth="lg">
      <div className="space-y-4">
        <FormField label="Title" required>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormField>
        <FormField label="Description" required>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
        </FormField>
        <FormField label="Location" required>
          <Select value={location} onChange={(e) => setLocation(e.target.value)}>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </Select>
        </FormField>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button loading={saving} onClick={handleSave}>Save changes</Button>
        </div>
      </div>
    </Modal>
  );
}

function PostRow({ item }: { item: Item }) {
  const { deleteItem, markResolved } = useItemActions();
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Delete this item? This cannot be undone.')) return;
    await deleteItem(item);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            {item.imageURL ? (
              <img src={item.imageURL} alt={item.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-2xl">
                <Package className="h-8 w-8 text-gray-300 dark:text-gray-600" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <Link
                to={`/item/${item.id}`}
                className="font-semibold text-gray-900 dark:text-white text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate"
              >
                {item.title}
              </Link>
              <Link
                to={`/item/${item.id}`}
                className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-2">
              <Badge variant={item.type}>{item.type === 'lost' ? '🔍 Lost' : '✅ Found'}</Badge>
              <Badge variant={item.status}>{item.status}</Badge>
              <CategoryBadge category={item.category} />
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500">
              {item.location} · {formatDate(item.date)} · Posted {formatRelative(item.createdAt)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)}>
            <Edit2 className="h-3.5 w-3.5" /> Edit
          </Button>
          {item.status !== 'resolved' && (
            <Button variant="ghost" size="sm" onClick={() => markResolved(item.id)} className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950">
              <CheckCircle className="h-3.5 w-3.5" /> Resolve
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 ml-auto"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </Button>
        </div>
      </div>

      <EditModal item={item} open={editOpen} onClose={() => setEditOpen(false)} />
    </>
  );
}

function MyPostsContent() {
  const { user } = useAuth();
  const { items, loading } = useUserItems(user?.uid);

  const lost = items.filter((i) => i.type === 'lost');
  const found = items.filter((i) => i.type === 'found');

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No posts yet</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Report a lost or found item to get started
        </p>
        <div className="flex gap-3">
          <Link to="/report/lost">
            <Button variant="outline">Report Lost</Button>
          </Link>
          <Link to="/report/found">
            <Button>Report Found</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {lost.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Lost Items ({lost.length})
          </h2>
          <div className="space-y-3">
            {lost.map((item) => <PostRow key={item.id} item={item} />)}
          </div>
        </section>
      )}

      {found.length > 0 && (
        <section>
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Found Items ({found.length})
          </h2>
          <div className="space-y-3">
            {found.map((item) => <PostRow key={item.id} item={item} />)}
          </div>
        </section>
      )}
    </div>
  );
}

export function MyPosts() {
  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Posts</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your lost and found reports
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/report/lost">
              <Button variant="outline" size="sm">+ Lost</Button>
            </Link>
            <Link to="/report/found">
              <Button size="sm">+ Found</Button>
            </Link>
          </div>
        </div>

        <MyPostsContent />
      </div>
    </AuthGuard>
  );
}
