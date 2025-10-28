// FIX: Provide mock data to be used across the application.
import { AnalyzedToken, TokenEventType, Trade } from './types';

// This data is used by the Login page.
// The User type in types.ts only defines `role` and `address`, but the login component
// also uses `id` and `name`. We define the full object here.
export const MOCK_USERS = [
  { id: 1, name: 'Agent Smith', role: 'Admin' as const, address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPoON85f' },
  { id: 2, name: 'Agent Trinity', role: 'Trader' as const, address: '7xKMG8m6gC8qVbJ5qT9pW3fH9sY8Z2cE6d' },
];

// This data is used by the PortfolioChart on the Dashboard.
export const PORTFOLIO_DATA = [
  { name: 'Jan', value: 40000 },
  { name: 'Feb', value: 35000 },
  { name: 'Mar', value: 52000 },
  { name: 'Apr', value: 48000 },
  { name: 'May', value: 61000 },
  { name: 'Jun', value: 75000 },
];

// This data is used as the initial set for the CryptoForensicsLab page.
export const MOCK_ANALYZED_TOKENS: AnalyzedToken[] = [
    { id: 'T1', name: 'CyberPepe', symbol: 'CYPE', eventType: TokenEventType.Pump, date: '2024-07-15', marketCap: 1500000, description: 'Massive overnight volume spike.' },
    { id: 'T2', name: 'SolanaChad', symbol: 'SCHAD', eventType: TokenEventType.RugPull, date: '2024-07-14', marketCap: 250000, description: 'Liquidity pulled from Raydium.' },
    { id: 'T3', name: 'QuantumLink', symbol: 'QLINK', eventType: TokenEventType.Tier1, date: '2024-07-12', marketCap: 500000000, description: 'Sustained growth and high volume.' },
    { id: 'T4', name: 'NeonProtocol', symbol: 'NEONP', eventType: TokenEventType.CEXListing, date: '2024-07-10', marketCap: 120000000, description: 'Rumors of Binance listing confirmed.' },
    { id: 'T5', name: 'AstroGlitch', symbol: 'AGL', eventType: TokenEventType.RugPull, date: '2024-07-09', marketCap: 50000, description: 'Deployer wallet sold all tokens.' },
];

// This data is used for the recent trades table on the Dashboard.
export const MOCK_TRADES: Trade[] = [
    { id: '1', pair: 'SOL/USDC', type: 'BUY', amount: 10, price: 150.5, timestamp: '2024-07-16 10:30:00', status: 'Completed' },
    { id: '2', pair: 'WIF/SOL', type: 'SELL', amount: 200, price: 2.1, timestamp: '2024-07-16 09:15:00', status: 'Completed' },
    { id: '3', pair: 'BONK/SOL', type: 'BUY', amount: 5000000, price: 0.000022, timestamp: '2024-07-16 08:45:00', status: 'Pending' },
    { id: '4', pair: 'JUP/USDC', type: 'BUY', amount: 500, price: 0.75, timestamp: '2024-07-15 18:00:00', status: 'Failed' },
];

export const TEST_WALLET_BALANCE = 0.5;