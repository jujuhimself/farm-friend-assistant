
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
  { 
    id: 'n1',
    title: 'Export Ban Lifted: Tanzanian Maize Flow Re-opens', 
    summary: 'The Ministry of Trade has officially terminated the seasonal export ban on Maize.',
    content: 'Following bilateral discussions with regional trade partners, the government has lifted all restrictions on grain exports. This policy shift is designed to alleviate surplus in the Southern Highlands and capitalize on high demand in GCC markets. Logistics nodes should prepare for immediate volume surges.',
    category: 'POLICY',
    date: 'MAR 20, 2024',
    author: 'GrainX Intel Unit',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'n2',
    title: 'Mbeya Weather Warning: 14-Day Precipitation Peak', 
    summary: 'Satellite data shows a high-pressure system building over the Southern Highlands.',
    content: 'Atmospheric telemetry suggests a 15% increase in seasonal rainfall for the Mbeya region. Farmers are advised to initiate early harvest protocols where moisture content is within the 13% buffer. Logistics teams should anticipate secondary road saturation and potential transit delays to Dar Port.',
    category: 'WEATHER',
    date: 'MAR 19, 2024',
    author: 'AgriMet Node',
    readTime: '3 min',
    image: 'https://images.unsplash.com/photo-1534088568595-a066f710b721?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'n3',
    title: 'Dar Port: Berth 5-7 Under Maintenance', 
    summary: 'Vessel turnaround times have increased by 38% this week.',
    content: 'Scheduled structural repairs on the main grain terminals (Berths 5-7) have limited active loading slots. While LCL consolidation continues at Berth 1, bulk carriers are experiencing 48-72 hour delays. We recommend shifting time-sensitive Cashew shipments to Tanga Port to maintain delivery confidence.',
    category: 'LOGISTICS',
    date: 'MAR 18, 2024',
    author: 'Port Control Data',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=800&auto=format&fit=crop'
  }
];

export const EXPORT_GUIDELINES = [
  { country: 'UAE', docs: ['Cert of Origin', 'SGS Quality Insp', 'Phytosanitary Cert'], transit: '12-14 Days' },
  { country: 'Germany', docs: ['Euro 1 Cert', 'Organic Cert', 'Pesticide Res Report', 'SGS'], transit: '22-26 Days' },
  { country: 'India', docs: ['Cert of Origin', 'Plant Quarantine Import Permit', 'Grade B Cert'], transit: '18-20 Days' },
  { country: 'China', docs: ['GACC Registration', 'Customs Entry Form', 'Purity Lab Result'], transit: '28-32 Days' },
];

export const SUPPLY_SIGNALS = [
  { region: 'MBEYA', status: 'SURPLUS', signal: 'BULLISH', crop: 'MAIZE' },
  { region: 'IRINGA', status: 'STABLE', signal: 'NEUTRAL', crop: 'SOYBEANS' },
  { region: 'MTWARA', status: 'SCARCITY', signal: 'BEARISH', crop: 'CASHEWS' },
  { region: 'MOROGORO', status: 'SURPLUS', signal: 'BULLISH', crop: 'RICE' },
];
