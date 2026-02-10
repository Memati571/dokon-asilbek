
import { Restaurant, MenuItem } from './types';

export const RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Shosh Milliy Taomlari',
    cuisine: 'O\'zbek taomlari',
    rating: 4.8,
    image: 'https://picsum.photos/seed/rest1/800/600',
    deliveryTime: '20-35 daqiqa',
    deliveryFee: 15000,
    address: 'Amir Temur ko\'chasi, 12'
  },
  {
    id: '2',
    name: 'Burger Empire',
    cuisine: 'Fast food, Burgerlar',
    rating: 4.5,
    image: 'https://picsum.photos/seed/rest2/800/600',
    deliveryTime: '15-25 daqiqa',
    deliveryFee: 10000,
    address: 'Navoiy ko\'chasi, 45'
  },
  {
    id: '3',
    name: 'Sushi Master',
    cuisine: 'Yapon taomlari',
    rating: 4.7,
    image: 'https://picsum.photos/seed/rest3/800/600',
    deliveryTime: '30-50 daqiqa',
    deliveryFee: 18000,
    address: 'Bobur ko\'chasi, 5'
  },
  {
    id: '4',
    name: 'Pizzeria Napoli',
    cuisine: 'Italiya taomlari, Pitsa',
    rating: 4.9,
    image: 'https://picsum.photos/seed/rest4/800/600',
    deliveryTime: '25-40 daqiqa',
    deliveryFee: 12000,
    address: 'Shota Rustaveli ko\'chasi, 22'
  }
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    restaurantId: '1',
    name: 'To\'y Oshi',
    description: 'An\'anaviy o\'zbek oshi, guruch, go\'sht, sabzi va maxsus ziravorlar bilan',
    price: 35000,
    category: 'Asosiy Taomlar',
    image: 'https://picsum.photos/seed/m1/400/300',
    isAvailable: true
  },
  {
    id: 'm2',
    restaurantId: '1',
    name: 'Qozon Kabob',
    description: 'Qovurilgan go\'sht va kartoshka',
    price: 45000,
    category: 'Asosiy Taomlar',
    image: 'https://picsum.photos/seed/m2/400/300',
    isAvailable: true
  },
  {
    id: 'm3',
    restaurantId: '2',
    name: 'Klassik Burger',
    description: 'Mol go\'shti kotleti, pishloq, sabzavotlar va maxsus sous',
    price: 28000,
    category: 'Burgerlar',
    image: 'https://picsum.photos/seed/m3/400/300',
    isAvailable: true
  },
  {
    id: 'm4',
    restaurantId: '2',
    name: 'Fri kartoshkasi',
    description: 'Qarsildoq oltinrang kartoshka',
    price: 12000,
    category: 'Sneklar',
    image: 'https://picsum.photos/seed/m4/400/300',
    isAvailable: true
  },
  {
    id: 'm5',
    restaurantId: '3',
    name: 'Filadelfiya Rollari',
    description: 'Sutli pishloq, losos va bodringli klassik rollar',
    price: 65000,
    category: 'Sushi',
    image: 'https://picsum.photos/seed/m5/400/300',
    isAvailable: true
  }
];
