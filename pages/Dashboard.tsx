// FIX: Implement the Dashboard page component.
import React from 'react';
import Card from '../components/shared/Card';
import PortfolioChart from '../components/charts/PortfolioChart';
import { Wallet } from '../types';
import { MOCK_TRADES } from '../constants';

interface DashboardProps {
  wallet: Wallet | null;
  isTestMode: boolean;
  botWalletBalance: number;
}

const Dashboard: React.FC<DashboardProps> = ({ wallet, isTestMode, botWalletBalance }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Your Wallet">
            {wallet ? (
                <>
                    <p className="text-3xl font-bold neon-cyan">{wallet.balance.toFixed(2)} SOL</p>
                    <p className="text-sm text-gray-400 font-mono break-all">{wallet.address}</p>
                </>
            ) : (
                <p className="text-gray-400">Connect wallet to view.</p>
            )}
        </Card>
        <Card title="Bot Wallet Balance">
            <p className="text-3xl font-bold neon-cyan">{botWalletBalance.toFixed(4)} SOL</p>
            <p className="text-sm text-gray-400">{isTestMode ? "Test wallet active" : "Live wallet active"}</p>
        </Card>
        <Card title="Mode">
            <p className={`text-3xl font-bold ${isTestMode ? 'neon-magenta' : 'neon-cyan'}`}>{isTestMode ? 'Test Mode' : 'Live Mode'}</p>
            <p className="text-sm text-gray-400">{isTestMode ? 'Trades are simulated.' : 'Live trading is active.'}</p>
        </Card>
         <Card title="Trades (24h)">
            <p className="text-3xl font-bold">128</p>
            <p className="text-sm text-gray-400">Executed</p>
        </Card>
      </div>
      
      <PortfolioChart />

      <Card title="Recent Trades">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs text-cyan-400 uppercase">
              <tr>
                <th className="p-2 select-none">Pair</th>
                <th className="p-2 select-none">Type</th>
                <th className="p-2 select-none">Amount</th>
                <th className="p-2 select-none">Price</th>
                <th className="p-2 select-none">Status</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_TRADES.map(trade => (
                <tr key={trade.id} className="border-b border-cyan-400/20 text-sm hover:bg-cyan-900/50 transition-colors">
                  <td className="p-2 font-bold">{trade.pair}</td>
                  <td className={`p-2 font-bold ${trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>{trade.type}</td>
                  <td className="p-2">{trade.amount.toLocaleString()}</td>
                  <td className="p-2 font-mono">${trade.price.toLocaleString()}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        trade.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                        trade.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                    }`}>
                        {trade.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;