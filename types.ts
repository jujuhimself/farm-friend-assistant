
export interface Commodity {
  ticker: string;
  name: string;
  price: number;
  change: number;
  history: { date: string; value: number }[];
}

export interface Activity {
  id: string;
  type: 'purchase' | 'rfq' | 'listing';
  timestamp: string;
  message: string;
  details: string;
}

export interface MarketInsight {
  icon: string;
  title: string;
  content: string;
}

export interface TradeNews {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'POLICY' | 'WEATHER' | 'LOGISTICS' | 'MARKET';
  date: string;
  author: string;
  readTime: string;
  image?: string;
}
