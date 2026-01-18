
import React from 'react';
import { Commodity, Activity, MarketInsight, TradeNews } from './types';

export const COMMODITIES: Commodity[] = [
  { ticker: 'MAZ', name: 'YELLOW MAIZE', price: 285.99, change: 3.25, history: Array.from({length: 20}, (_, i) => ({ date: i.toString(), value: 270 + Math.random() * 30 })) },
  { ticker: 'RIC', name: 'LONG GRAIN RICE', price: 620.49, change: -1.8, history: Array.from({length: 20}, (_, i) => ({ date: i.toString(), value: 600 + Math.random() * 40 })) },
  { ticker: 'CSW', name: 'CASHEWS', price: 1247.46, change: 5.41, history: Array.from({length: 20}, (_, i) => ({ date: i.toString(), value: 1200 + Math.random() * 100 })) },
  { ticker: 'SOY', name: 'SOYBEANS', price: 440.55, change: 0.69, history: Array.from({length: 20}, (_, i) => ({ date: i.toString(), value: 430 + Math.random() * 20 })) },
  { ticker: 'SES', name: 'SESAME', price: 1850.20, change: 2.1, history: Array.from({length: 20}, (_, i) => ({ date: i.toString(), value: 1800 + Math.random() * 100 })) },
  { ticker: 'TEA', name: 'TEA', price: 3200.50, change: -0.5, history: Array.from({length: 20}, (_, i) => ({ date: i.toString(), value: 3100 + Math.random() * 200 })) },
  { ticker: 'COF', name: 'COFFEE', price: 2450.80, change: 1.2, history: Array.from({length: 20}, (_, i) => ({ date: i.toString(), value: 2400 + Math.random() * 150 })) },
  { ticker: 'SUN', name: 'SUNFLOWER', price: 680.30, change: 0.8, history: Array.from({length: 20}, (_, i) => ({ date: i.toString(), value: 650 + Math.random() * 50 })) },
];

export const INITIAL_ACTIVITIES: Activity[] = [
  { id: '1', type: 'purchase', timestamp: '2 min ago', message: 'Buyer from UAE purchased 150 MT Yellow Maize', details: '$285/MT • Supplier: Mazaohub (Mbeya)' },
  { id: '2', type: 'rfq', timestamp: '8 min ago', message: 'Buyer from India requested quote: 200 MT Sesame', details: 'Destination: Mumbai • 3 suppliers responded' },
  { id: '3', type: 'purchase', timestamp: '12 min ago', message: 'Buyer from Germany purchased 80 MT Cashews', details: '$1,250/MT • Supplier: Kilimanjaro Agro' },
  { id: '4', type: 'listing', timestamp: '15 min ago', message: 'New listing: 300 MT Long Grain Rice (Morogoro)', details: '$620/MT • Grade A • [VIEW LISTING →]' },
  { id: '5', type: 'purchase', timestamp: '18 min ago', message: 'Buyer from Spain purchased 120 MT Soybeans', details: '$440/MT • Supplier: Mbeya Traders Co.' },
];

export const AI_INSIGHTS: MarketInsight[] = [
  { icon: '💡', title: 'OPPORTUNITY', content: 'Maize prices expected to drop 8-12% in next 30 days due to harvest onset in Southern Highlands.' },
  { icon: '⚠️', title: 'WARNING', content: 'Port congestion in Dar es Salaam increasing. Add 2-3 days to all shipping lead time estimates.' },
  { icon: '🎯', title: 'TARGET', content: 'Sesame demand from India up 35%. Current pricing is optimal for liquidation of stock.' },
];

export const TRADE_NEWS: TradeNews[] = [
  { title: 'Export Ban Lifted', summary: 'Tanzania removes maize export restrictions, leading to stabilized regional prices.' },
  { title: 'Weather Alert', summary: 'Heavy rains in Mbeya region may delay harvest logistics by 10-14 days.' },
  { title: 'Import Surge', summary: 'India increases sesame import quotas, driving TZS export volumes to record highs.' },
];

export const COLLECTIVE_STATS = {
  weeklyVolumeMT: 1420,
  volumeGrowth: 15.4,
  avgOrderSizeMT: 85,
  topGrowingDestination: 'UAE',
  destinationGrowth: 35.2,
  activeBuyerRegions: [
    { region: 'UAE', behavior: 'Prefer 50-100 MT Sesame/Month', norm: 'Grade A only' },
    { region: 'India', behavior: 'Grade B Maize for feed use', norm: 'Bulk orders > 200 MT' },
    { region: 'Germany', behavior: 'Organic Cashews', norm: 'Small, frequent shipments' },
    { region: 'China', behavior: 'Soybeans for oil processing', norm: 'Strict purity requirements' },
  ]
};
