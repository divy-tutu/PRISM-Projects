import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Textarea, FormField } from '../ui/Input';
import { Button } from '../ui/Button';
import { useClaimActions } from '../../hooks/useClaims';
import { useAuth } from '../../contexts/AuthContext';
import type { Item } from '../../types';

const claimSchema = z.object({
  message: z
    .string()
    .min(20, 'Please provide at least 20 characters describing your item')
    .max(500, 'Message too long'),
});

type ClaimFormData = z.infer<typeof claimSchema>;

interface ClaimModalProps {
  item: Item;
  open: boolean;
  onClose: () => void;
}

export function ClaimModal({ item, open, onClose }: ClaimModalProps) {
  const { user } = useAuth();
  const { submitClaim, submitting } = useClaimActions();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClaimFormData>({ resolver: zodResolver(claimSchema) });

  const onSubmit = async (data: ClaimFormData) => {
    if (!user) return;
    try {
      await submitClaim(item.id, user.uid, user.name, user.email, data.message);
      reset();
      onClose();
    } catch {
      // error already toasted
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="This might be mine">
      <div className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Describe why you believe this <strong className="text-gray-700 dark:text-gray-300">{item.title}</strong> belongs to you. Include details like when/where you lost it, any identifying features, etc.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Your message" error={errors.message?.message} required>
            <Textarea
              placeholder="e.g. I lost my blue water bottle near the CS department on Monday morning. It has a sticker of a mountain on the side…"
              {...register('message')}
              rows={5}
            />
          </FormField>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={submitting}>
              Submit Claim
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
