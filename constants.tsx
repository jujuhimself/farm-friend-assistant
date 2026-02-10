
import React from 'react';
import { Commodity, Activity, MarketInsight, TradeNews } from './types';

export const COMMODITIES: Commodity[] = [
  { ticker: 'MAZ', name: 'YELLOW MAIZE', price: 285.99, change: 3.25, history: Array.from({length: 20}, (_, i) => ({ date: i.toString(), value: 270 + Math.random() * 30 })) },
  { ticker: 'RIC', name: 'LONG GRAIN RICE', price: 620.49, change: -1.8, history: Array.from({length: 20}, (_, i) => ({ date: i.toString(), value: 600 + Math.random() * 40 })) },
  { ticker: 'CSW', name: 'CASHEWS', price: 1247.46, change: 5.41, history: Array.from({length: 20}, (_, i) => ({ date: i.toString(), value: 1200 + Math.random() * 100 })) },
  { ticker: 'SOY', name: 'SOYBEANS', price: 440.55, change: 0.69, history: Array.from({length: 20}, (_, i) => ({ date: i.toString(), value: 430 + Math.random() * 20 })) },
  { ticker: 'SES', name: 'SESAME', price: 1850.20, change: 2.1, history: Array.from({length: 20}, (_, i) => ({ date: i.toString(), value: 1800 + Math.random() * 100 })) },
  { ticker: 'AVO', name: 'HASS AVOCADOS', price: 1.25, change: 4.5, history: Array.from({length: 20}, (_, i) => ({ date: i.toString(), value: 1.1 + Math.random() * 0.2 })) },
  { ticker: 'VNL', name: 'VANILLA BEANS', price: 180.00, change: -2.1, history: Array.from({length: 20}, (_, i) => ({ date: i.toString(), value: 170 + Math.random() * 20 })) },
];

export const LISTINGS = [
  { id: 'L-1', crop: 'YELLOW MAIZE', origin: 'Mbeya', volume: '1,200 MT', price: 272, grade: 'A', supplier: 'Mazaohub' },
  { id: 'L-2', crop: 'LONG GRAIN RICE', origin: 'Morogoro', volume: '800 MT', price: 615, grade: 'A', supplier: 'Kilombero Agro' },
  { id: 'L-3', crop: 'SOYBEANS', origin: 'Iringa', volume: '450 MT', price: 438, grade: 'B', supplier: 'Mbeya Traders' },
  { id: 'L-4', crop: 'SESAME', origin: 'Lindi', volume: '300 MT', price: 1845, grade: 'A', supplier: 'Southern Collective' },
  { id: 'L-5', crop: 'HASS AVOCADOS', origin: 'Njombe', volume: '45 MT', price: 1.25, grade: 'A', supplier: 'Highland Fresh' },
  { id: 'L-6', crop: 'VANILLA BEANS', origin: 'Kagera', volume: '12 MT', price: 180, grade: 'PREMIUM', supplier: 'Victoria Spices' },
  { id: 'L-7', crop: 'CASHEWS', origin: 'Mtwara', volume: '2,000 MT', price: 1240, grade: 'A', supplier: 'Coastal Exports' },
];

export const REGIONS = ['ALL REGIONS', 'MBEYA', 'MOROGORO', 'IRINGA', 'MTWARA', 'ARUSHA', 'MANYARA', 'NJOMBE', 'KAGERA'];

export const INITIAL_ACTIVITIES: Activity[] = [
  { id: '1', type: 'purchase', timestamp: '2 min ago', message: 'Buyer from UAE purchased 150 MT Yellow Maize', details: '$285/MT • Supplier: Mazaohub (Mbeya)' },
  { id: '2', type: 'rfq', timestamp: '8 min ago', message: 'Buyer from India requested quote: 200 MT Sesame', details: 'Destination: Mumbai • 3 suppliers responded' },
  { id: '3', type: 'purchase', timestamp: '12 min ago', message: 'Buyer from Germany purchased 80 MT Cashews', details: '$1,250/MT • Supplier: Kilimanjaro Agro' },
];

export const AI_INSIGHTS: MarketInsight[] = [
  { icon: '💡', title: 'OPPORTUNITY', content: 'Avocado peak harvest begins in 14 days in Njombe. Logistics slots are filling fast.' },
  { icon: '⚠️', title: 'WARNING', content: 'Port congestion in Dar es Salaam increasing. Add 2-3 days to all shipping lead time estimates.' },
];

export const TRADE_NEWS: TradeNews[] = [
  { 
    id: 'n1',
    title: 'Export Ban Lifted: Tanzanian Maize Flow Re-opens', 
    summary: 'The Ministry of Trade has officially terminated the seasonal export ban on Maize.',
    content: 'Policy shift designed to alleviate surplus in the Southern Highlands and capitalize on high demand in GCC markets.',
    category: 'POLICY',
    date: 'MAR 20, 2024',
    author: 'GrainX Intel Unit',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=800&auto=format&fit=crop'
  },
];

export const EXPORT_GUIDELINES = [
  { country: 'UAE', docs: ['Cert of Origin', 'SGS Quality Insp', 'Phytosanitary Cert'], transit: '12-14 Days' },
  { country: 'Germany', docs: ['Euro 1 Cert', 'Organic Cert', 'Pesticide Res Report', 'SGS'], transit: '22-26 Days' },
  { country: 'China', docs: ['GACC Registration', 'Customs Entry Form', 'Purity Lab Result'], transit: '28-32 Days' },
  { country: 'Ireland', docs: ['Phytosanitary Cert', 'Organic Compliance', 'HACCP Cert'], transit: '24-28 Days' },
];

export const SUPPLY_SIGNALS = [
  { region: 'MBEYA', crop: 'YELLOW MAIZE', signal: 'BULLISH', status: 'HARVEST_SURPLUS' },
  { region: 'MOROGORO', crop: 'LONG GRAIN RICE', signal: 'BEARISH', status: 'LOGISTICS_DELAY' },
  { region: 'LINDI', crop: 'SESAME', signal: 'BULLISH', status: 'GLOBAL_DEMAND' },
  { region: 'NJOMBE', crop: 'HASS AVOCADOS', signal: 'BULLISH', status: 'PEAK_SEASON' },
];

export const CROP_INTEL_EXTENDED: Record<string, any> = {
  'AVOCADOS': {
    name: 'Hass Avocados',
    ticker: 'AVO',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=800&auto=format&fit=crop',
    description: 'Tanzania is the 3rd largest producer in Africa. Our Hass variety is prized for high oil content (18-22%) and exceptional shelf life.',
    sentiment: 'BULLISH',
    marketCap: '$240M EST',
    lastSale: '$1.25/kg',
    change: '+4.5%',
    regions: [
      { name: 'Njombe', volume: '12,500 MT', price: '$1.25', quality: 'AAA', elevation: '1900m' },
      { name: 'Iringa', volume: '8,400 MT', price: '$1.22', quality: 'AA', elevation: '1600m' },
      { name: 'Mbeya', volume: '15,200 MT', price: '$1.20', quality: 'AAA', elevation: '1750m' }
    ],
    seasonality: [
      { month: 'Jan', status: 'Planting' }, { month: 'Feb', status: 'Growth' }, 
      { month: 'Mar', status: 'Peak Harvest' }, { month: 'Apr', status: 'Peak Harvest' },
      { month: 'May', status: 'Harvesting' }, { month: 'Jun', status: 'End of Season' },
      { month: 'Jul', status: 'Dormant' }, { month: 'Aug', status: 'Dormant' },
      { month: 'Sep', status: 'Pruning' }, { month: 'Oct', status: 'Flowering' },
      { month: 'Nov', status: 'Growth' }, { month: 'Dec', status: 'Growth' }
    ],
    logistics: {
      china: { transit: '28 Days', demand: 'EXTREME', risk: 'LOW' },
      ireland: { transit: '22 Days', demand: 'HIGH', risk: 'MODERATE' }
    }
  },
  'VANILLA': {
    name: 'Planifolia Vanilla',
    ticker: 'VNL',
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800&auto=format&fit=crop',
    description: 'Bourbon-style Planifolia beans. Sourced primarily from the humid Kagera region bordering Lake Victoria.',
    sentiment: 'STABLE',
    marketCap: '$45M EST',
    lastSale: '$180.00/kg',
    change: '-1.2%',
    regions: [
      { name: 'Kagera', volume: '45 MT', price: '$180.00', quality: 'PREMIUM', elevation: '1100m' },
      { name: 'Morogoro', volume: '12 MT', price: '$175.00', quality: 'GRADE A', elevation: '900m' }
    ],
    seasonality: [
      { month: 'Jan', status: 'Curing' }, { month: 'Feb', status: 'Curing' }, 
      { month: 'Mar', status: 'Curing' }, { month: 'Apr', status: 'Exporting' },
      { month: 'May', status: 'Exporting' }, { month: 'Jun', status: 'Exporting' },
      { month: 'Jul', status: 'Pollination' }, { month: 'Aug', status: 'Growth' },
      { month: 'Sep', status: 'Growth' }, { month: 'Oct', status: 'Growth' },
      { month: 'Nov', status: 'Growth' }, { month: 'Dec', status: 'Curing' }
    ],
    logistics: {
      china: { transit: '32 Days', demand: 'HIGH', risk: 'LOW' },
      ireland: { transit: '25 Days', demand: 'PREMIUM', risk: 'LOW' }
    }
  },
  'MAIZE': {
    name: 'Yellow Maize',
    ticker: 'MAZ',
    image: 'https://images.unsplash.com/photo-1551733938-466a992c3677?q=80&w=800&auto=format&fit=crop',
    description: 'The staple commodity of East Africa. Tanzania produces 6M+ MT annually, with major surpluses in the Southern Highlands.',
    sentiment: 'BEARISH',
    marketCap: '$1.8B EST',
    lastSale: '$285.99/MT',
    change: '+3.2%',
    regions: [
      { name: 'Mbeya', volume: '450,000 MT', price: '$272', quality: 'GRADE A', elevation: '1700m' },
      { name: 'Songea', volume: '320,000 MT', price: '$265', quality: 'GRADE B+', elevation: '1100m' },
      { name: 'Sumbawanga', volume: '580,000 MT', price: '$268', quality: 'GRADE A', elevation: '1500m' }
    ],
    seasonality: [
      { month: 'Jan', status: 'Planting' }, { month: 'Feb', status: 'Growth' }, 
      { month: 'Mar', status: 'Growth' }, { month: 'Apr', status: 'Harvesting' },
      { month: 'May', status: 'Peak Supply' }, { month: 'Jun', status: 'Exporting' },
      { month: 'Jul', status: 'Exporting' }, { month: 'Aug', status: 'Supply Depletion' },
      { month: 'Sep', status: 'Tilling' }, { month: 'Oct', status: 'Planting' },
      { month: 'Nov', status: 'Growth' }, { month: 'Dec', status: 'Growth' }
    ],
    logistics: {
      china: { transit: '30 Days', demand: 'STABLE', risk: 'LOW' },
      ireland: { transit: '24 Days', demand: 'MODERATE', risk: 'LOW' }
    }
  }
};
