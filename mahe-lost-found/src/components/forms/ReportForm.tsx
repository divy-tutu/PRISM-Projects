import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { X, Image } from 'lucide-react';
import { Input, Textarea, Select, FormField } from '../ui/Input';
import { Button } from '../ui/Button';
import { useItemActions } from '../../hooks/useItems';
import { useAuth } from '../../contexts/AuthContext';
import { CATEGORIES, LOCATIONS } from '../../lib/constants';
import type { ItemType, Category } from '../../types';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(10, 'Please provide a detailed description').max(1000),
  category: z.string().min(1, 'Please select a category'),
  location: z.string().min(1, 'Please enter a location'),
  date: z.string().min(1, 'Please select a date'),
});

type FormData = z.infer<typeof schema>;

interface ReportFormProps {
  type: ItemType;
}

export function ReportForm({ type }: ReportFormProps) {
  const { user } = useAuth();
  const { createItem, uploading } = useItemActions();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data: FormData) => {
    if (!user) return;
    const id = await createItem({
      type,
      title: data.title,
      description: data.description,
      category: data.category as Category,
      location: data.location,
      date: data.date,
      imageFile,
      ownerId: user.uid,
      ownerName: user.name,
      ownerEmail: user.email,
    });
    navigate(`/item/${id}`);
  };

  const isLost = type === 'lost';
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField label="Title" error={errors.title?.message} required>
        <Input
          placeholder={isLost ? 'e.g. Blue Casio calculator' : 'e.g. Found a set of keys near Library'}
          {...register('title')}
        />
      </FormField>

      <FormField label="Description" error={errors.description?.message} required hint="Include identifying details, color, brand, serial numbers, etc.">
        <Textarea
          placeholder={
            isLost
              ? 'Describe your item in detail — color, brand, any unique features…'
              : 'Describe where and how you found it, and any distinguishing features…'
          }
          rows={5}
          {...register('description')}
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Category" error={errors.category?.message} required>
          <Select {...register('category')}>
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.emoji} {cat.label}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label={isLost ? 'Date Lost' : 'Date Found'}
          error={errors.date?.message}
          required
        >
          <Input type="date" max={today} {...register('date')} />
        </FormField>
      </div>

      <FormField
        label={isLost ? 'Last Seen Location' : 'Found Location'}
        error={errors.location?.message}
        required
      >
        <Select {...register('location')}>
          <option value="">Select a location</option>
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </Select>
      </FormField>

      {/* Image upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Photo <span className="text-gray-400 font-normal">(optional, max 5MB)</span>
        </label>

        {imagePreview ? (
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 group">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-52 object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-36 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-indigo-500 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors cursor-pointer"
          >
            <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Image className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium">Click to upload photo</p>
            <p className="text-xs">PNG, JPG, WEBP up to 5MB</p>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleImage}
          className="sr-only"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        loading={isSubmitting || uploading}
      >
        {isLost ? '🔍 Report Lost Item' : '✅ Report Found Item'}
      </Button>
    </form>
  );
}
