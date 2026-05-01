/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product } from './types';

export const COLORS = {
  navy: '#0D1B2A',
  whatsapp: '#25D366',
  whatsappDark: '#128C7E',
  accent: '#F27D26', // Artistic Flair Orange
  glass: 'rgba(255, 255, 255, 0.03)',
};

export const IMAGES = {
  icon: '/src/assets/images/app_icon_1777619523688.png',
  heroAd: '/src/assets/images/hero_ad_generator_1777619539309.png',
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Nike Air Force 1',
    price: 45,
    location: 'Harare CBD',
    category: 'Footwear',
    image: 'https://picsum.photos/seed/sneaker1/400/400',
    sellerWhatsApp: '263770000000',
    isSponsored: true,
  },
  {
    id: '2',
    name: 'Samsung Galaxy S21',
    price: 320,
    location: 'Avondale',
    category: 'Electronics',
    image: 'https://picsum.photos/seed/phone1/400/400',
    sellerWhatsApp: '263770000001',
  },
  {
    id: '3',
    name: 'Adjustable Wrench Set',
    price: 15,
    location: 'Mbare',
    category: 'Tools',
    image: 'https://picsum.photos/seed/tools1/400/400',
    sellerWhatsApp: '263770000002',
  },
  {
    id: '4',
    name: 'MacBook Air M1',
    price: 750,
    location: 'Borrowdale',
    category: 'Electronics',
    image: 'https://picsum.photos/seed/laptop1/400/400',
    sellerWhatsApp: '263770000003',
  },
  {
    id: '5',
    name: 'Timberland Boots',
    price: 55,
    location: 'Westgate',
    category: 'Footwear',
    image: 'https://picsum.photos/seed/boots1/400/400',
    sellerWhatsApp: '263770000004',
  },
];
