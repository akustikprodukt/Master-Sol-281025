export interface User {
  role: 'Admin' | 'Trader';
  address: string;
}

export interface Wallet {
  address: string;
  balance: number;
}

export enum TokenEventType {
  RugPull = 'Rug Pull',
  Pump = 'Pump & Dump',
  Tier1 = 'Tier-1 Growth',
  CEXListing = 'CEX Listing',
}

export interface AnalyzedToken {
  id: string;
  name: string;
  symbol: string;
  eventType: TokenEventType;
  date: string;
  marketCap: number;
  description: string;
}

export interface Trade {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  amount: number;
  price: number;
  timestamp: string;
  status: 'Completed' | 'Pending' | 'Failed';
}
