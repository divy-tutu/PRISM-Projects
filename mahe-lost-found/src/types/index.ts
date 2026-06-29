export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  createdAt: Date;
}

export type ItemType = 'lost' | 'found';
export type ItemStatus = 'open' | 'claimed' | 'resolved';
export type ClaimStatus = 'pending' | 'approved' | 'rejected';

export type Category =
  | 'id-card'
  | 'wallet'
  | 'keys'
  | 'laptop'
  | 'phone'
  | 'tablet'
  | 'earphones'
  | 'watch'
  | 'calculator'
  | 'water-bottle'
  | 'bag'
  | 'umbrella'
  | 'clothing'
  | 'lab-equipment'
  | 'books'
  | 'electronics'
  | 'other';

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  description: string;
  category: Category;
  location: string;
  date: string;
  imageURL?: string;
  status: ItemStatus;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  createdAt: Date;
  claimCount?: number;
}

export interface Claim {
  id: string;
  itemId: string;
  claimerId: string;
  claimerName: string;
  claimerEmail: string;
  message: string;
  status: ClaimStatus;
  createdAt: Date;
}

export interface ItemFilters {
  search: string;
  category: Category | '';
  type: ItemType | '';
  status: ItemStatus | '';
  location: string;
}

export interface SiteStats {
  lostCount: number;
  foundCount: number;
  resolvedCount: number;
}
