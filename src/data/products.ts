import { Tea } from '@/types';

export const SEED_TEAS: Tea[] = [
  {
    id: 't1',
    name: 'Dragon Well',
    category: 'Green',
    origin: 'Hangzhou, China',
    price: 8.50,
    stock: 24,
    steepTime: '2–3 min',
    steepTemp: '75°C',
    liquorColor: '#C9D6A0',
    description:
      'A pan-fired green tea with a flat leaf and a toasted-chestnut sweetness. Bright and clean in the cup.',
  },
  {
    id: 't2',
    name: 'Silver Needle',
    category: 'White',
    origin: 'Fujian, China',
    price: 12.00,
    stock: 14,
    steepTime: '4–5 min',
    steepTemp: '80°C',
    liquorColor: '#F2E7C4',
    description:
      'Whole downy buds, barely processed. Delicate, honeyed, and quiet — the lightest tea in the shop.',
  },
  {
    id: 't3',
    name: 'Ti Kuan Yin',
    category: 'Oolong',
    origin: 'Anxi, China',
    price: 10.50,
    stock: 19,
    steepTime: '3 min',
    steepTemp: '90°C',
    liquorColor: '#E7C463',
    description:
      'Rolled oolong with an orchid aroma and a long, creamy finish. Good for multiple steeps.',
  },
  {
    id: 't4',
    name: 'Assam Breakfast',
    category: 'Black',
    origin: 'Assam, India',
    price: 7.00,
    stock: 31,
    steepTime: '4 min',
    steepTemp: '95°C',
    liquorColor: '#8A3D1E',
    description:
      'Malty and full-bodied, built to take milk. The house wake-up cup.',
  },
  {
    id: 't5',
    name: 'Earl Grey Reserve',
    category: 'Black',
    origin: 'Ceylon, blended',
    price: 9.00,
    stock: 22,
    steepTime: '3–4 min',
    steepTemp: '95°C',
    liquorColor: '#6A392A',
    description:
      'Ceylon black scented with bergamot oil and a trace of cornflower. Citrus-forward, not soapy.',
  },
  {
    id: 't6',
    name: 'Jasmine Pearl',
    category: 'Green',
    origin: 'Fujian, China',
    price: 11.00,
    stock: 0,
    steepTime: '2–3 min',
    steepTemp: '80°C',
    liquorColor: '#D7DC9F',
    description:
      'Hand-rolled green pearls scented over jasmine blossom nightly for a week. Perfumed, never bitter.',
  },
  {
    id: 't7',
    name: 'Chamomile Bloom',
    category: 'Herbal',
    origin: 'Nile Delta, Egypt',
    price: 6.50,
    stock: 27,
    steepTime: '5 min',
    steepTemp: '100°C',
    liquorColor: '#E9C359',
    description:
      'Whole dried chamomile flowers, apple-sweet and calming. Caffeine-free.',
  },
  {
    id: 't8',
    name: 'Rooibos Sunset',
    category: 'Herbal',
    origin: 'Cederberg, South Africa',
    price: 6.00,
    stock: 18,
    steepTime: '6 min',
    steepTemp: '100°C',
    liquorColor: '#A8461E',
    description:
      'Red bush tea with notes of vanilla and dried fig. Naturally sweet, caffeine-free.',
  },
  {
    id: 't9',
    name: 'Aged Pu-erh',
    category: 'Pu-erh',
    origin: 'Yunnan, China',
    price: 14.00,
    stock: 9,
    steepTime: '3 min',
    steepTemp: '100°C',
    liquorColor: '#4A2C1D',
    description:
      'Compressed and fermented for depth — earthy, smooth, almost cocoa-like after a decade of aging.',
  },
];

export function getTea(id: string): Tea | undefined {
  return SEED_TEAS.find((t) => t.id === id);
}
