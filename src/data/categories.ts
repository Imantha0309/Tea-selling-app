export const CATEGORIES = ['All', 'Green', 'White', 'Oolong', 'Black', 'Herbal', 'Pu-erh'] as const;

export type CategoryName = (typeof CATEGORIES)[number];

export const ALL_CATEGORY: CategoryName = 'All';
