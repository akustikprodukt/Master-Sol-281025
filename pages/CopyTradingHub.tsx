import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/shared/Card';
import InfoIcon from '../components/icons/InfoIcon';
import Modal from '../components/shared/Modal';
import { Trade } from '../types';
import { GoogleGenAI } from '@google/genai';

interface CopyTradingHubProps {
  botPrivateKey: string;
  botWalletBalance: number;
  setBotWalletBalance: (updater: (prev: number) => number) => void;
}

const TOP_WALLETS_TO_SCAN = [
    '7xKMG8m6gC8qVbJ5qT9pW3fH9sY8Z2cE6d',
    '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehX',
    'So1111111111111111111111111111111111',
    'BonK1Y...421J'
];

const TOKEN_PAIRS = ['WIF/SOL', 'BONK/SOL', 'JUP/USDC', 'PYTH/SOL', 'CYPE/SOL'];

const CopyTradingHub: React.FC<CopyTradingHubProps> = ({ botPrivateKey, botWalletBalance, setBotWalletBalance }) => {
  const [isBotEnabled, setIsBotEnabled] = useState(false);
  const [tradeAmount, setTradeAmount] = useState(0.1);
  const [botStatus, setBotStatus] = useState<'Offline' | 'Initializing' | 'Running' | 'Error'>('Offline');
  const [logs, setLogs] = useState<string[]>([]);
  const [liveTrades, setLiveTrades] = useState<Trade[]>([]);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);
  const [realizedPnl, setRealizedPnl] = useState(0);
  const logIntervalRef = useRef<any>(null);

  // AI Analysis State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInsight, setAiInsight] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);


  useEffect(() => {
    if (botPrivateKey) {
        setLogs([`${new Date().toLocaleTimeString()}: [SYS] Bot ready. Enable to start copy trading.`]);
    } else {
        setBotStatus('Offline');
        setLogs([`${new Date().toLocaleTimeString()}: [SYS] Bot offline. No private key configured.`]);
        setLiveTrades([]);
    }
  }, [botPrivateKey]);


  useEffect(() => {
    if (isBotEnabled && botPrivateKey) {
      setRealizedPnl(0); // Reset PnL for new session
      setLiveTrades([]); // Reset trades for new session
      setBotStatus('Initializing');
      addLog('[SYS] Bot is initializing...');
      
      const initTimeout = setTimeout(() => {
        setBotStatus('Running');
        addLog(`[SYS] Bot is online and running. Trade amount set to ${tradeAmount} SOL.`);
        
        const simulationCycle = () => {
          addLog('[INFO] Scanning Top Wallets for new transactions...');

          // 40% chance to detect a trade each cycle
          if (Math.random() > 0.6) { 
            setTimeout(() => {
              const randomWallet = TOP_WALLETS_TO_SCAN[Math.floor(Math.random() * TOP_WALLETS_TO_SCAN.length)];
              const randomPair = TOKEN_PAIRS[Math.floor(Math.random() * TOKEN_PAIRS.length)];
              const tradeType: 'BUY' | 'SELL' = Math.random() > 0.5 ? 'BUY' : 'SELL';

              addLog(`[DETECT] New ${tradeType} trade detected on wallet ${randomWallet.substring(0, 6)}...`);
              
              setTimeout(() => {
                if (tradeType === 'BUY' && botWalletBalance < tradeAmount) {
                  addLog(`[FAIL] Trade failed: Insufficient funds. Need ${tradeAmount} SOL, have ${botWalletBalance.toFixed(4)} SOL.`);
                  logIntervalRef.current = setTimeout(simulationCycle, Math.random() * 4000 + 3000);
                  return;
                }
                
                addLog(`[EXEC] Executing copy trade: ${tradeType} ${randomPair} for ${tradeAmount} SOL...`);

                setTimeout(() => {
                  const isSuccess = Math.random() > 0.1; // 90% success rate
                  if (isSuccess) {
                    const txId = `Tx${(Math.random() * 1e18).toString(16)}`;
                    addLog(`[SUCCESS] Trade completed. TxID: ${txId.substring(0, 10)}...`);
                    
                    let pnl = 0;
                    if (tradeType === 'SELL') {
                        pnl = (Math.random() - 0.4) * tradeAmount; 
                        setRealizedPnl(prevPnl => prevPnl + pnl);
                        setBotWalletBalance(prev => prev + tradeAmount + pnl);
                    } else { // BUY
                        setBotWalletBalance(prev => prev - tradeAmount);
                    }
                    
                    const newTrade: Trade = {
                        id: txId,
                        pair: randomPair,
                        type: tradeType,
                        amount: tradeAmount / (Math.random() * 2 + 0.5),
                        price: Math.random() * 2 + 0.5,
                        timestamp: new Date().toISOString(),
                        status: 'Completed'
                    };
                    setLiveTrades(prev => [newTrade, ...prev].slice(0, 10));

                  } else {
                    addLog(`[FAIL] Trade failed: High slippage or network congestion.`);
                  }
                }, 1500);
              }, 1000);
            }, 500);
          }
          logIntervalRef.current = setTimeout(simulationCycle, Math.random() * 4000 + 3000);
        };
        
        logIntervalRef.current = setTimeout(simulationCycle, 1000);

      }, 2000);

      return () => clearTimeout(initTimeout);

    } else {
      clearTimeout(logIntervalRef.current);
      setBotStatus('Offline');
      if (botPrivateKey) {
        addLog('[SYS] Bot has been disabled by user.');
      }
    }
    
    return () => clearTimeout(logIntervalRef.current);
  }, [isBotEnabled, botPrivateKey, tradeAmount, botWalletBalance]);
  
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`${timestamp}: ${message}`, ...prev].slice(0, 50));
  };
  
  const handleGetAiInsight = async () => {
    if (liveTrades.length === 0) return;

    setIsAiModalOpen(true);
    setIsAnalyzing(true);
    setAiInsight('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const tradeHistory = liveTrades.map(t => `- ${t.type} ${t.pair} @ price ${t.price.toFixed(4)}`).join('\n');
      const prompt = `
        As an expert crypto trading analyst, review the following recent trade data from a copy trading bot on the Solana network.
        
        Current Bot Status: ${botStatus}
        Session Realized P&L: ${realizedPnl.toFixed(4)} SOL
        Recent Trades:
        ${tradeHistory}

        Based on this data, provide a concise market analysis and one predictive insight. Identify any emerging trends (e.g., momentum on a specific token, market volatility). Suggest one potential high-probability opportunity or a word of caution for the bot's next moves. Keep the analysis brief and actionable.
      `;

      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
      setAiInsight(response.text);

    } catch (error) {
      console.error("Gemini API Error:", error);
      setAiInsight("Error: Could not retrieve AI insight. The AI subsystem may be offline. Please check the browser console for more details.");
    } finally {
      setIsAnalyzing(false);
    }
  };


  if (!botPrivateKey) {
    return (
      <Card title="Copy Trading Hub // OFFLINE">
        <div className="flex items-center bg-red-900/30 border border-red-500/50 text-red-300 p-4 rounded-md">
          <InfoIcon className="w-6 h-6 mr-4 flex-shrink-0" />
          <div>
            <h4 className="font-bold">Bot is Offline</h4>
            <p className="text-sm">A private key for the trading bot has not been configured. Please go to the <strong>Admin Panel</strong> to set up the bot wallet.</p>
          </div>
        </div>
      </Card>
    );
  }
  
  const getStatusColor = () => {
    switch(botStatus) {
        case 'Running': return 'text-green-400 animate-pulse';
        case 'Initializing': return 'text-yellow-400 animate-pulse';
        case 'Error': return 'text-red-400';
        default: return 'text-gray-500';
    }
  }

  return (
    <div className="space-y-6">
       <style>{`
        @keyframes fadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-in-out forwards; }
      `}</style>
      <Card title="Bot Status & Performance">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center items-center">
            <div>
                <p className="text-sm uppercase text-gray-400 tracking-widest">// Status</p>
                <p className={`text-2xl font-bold ${getStatusColor()}`}>{botStatus}</p>
            </div>
            <div>
                <p className="text-sm uppercase text-gray-400 tracking-widest">// Realized P&L (Session)</p>
                <p key={realizedPnl} className={`text-2xl font-bold ${realizedPnl >= 0 ? 'text-green-400' : 'text-red-400'} animate-fadeIn`}>
                    {realizedPnl >= 0 ? '+' : ''}{realizedPnl.toFixed(4)} SOL
                </p>
            </div>
            <div>
                <p className="text-sm uppercase text-gray-400 tracking-widest">// Trades (Session)</p>
                <p className="text-2xl font-bold">{liveTrades.length}</p>
            </div>
            <div>
                <button
                    onClick={handleGetAiInsight}
                    disabled={liveTrades.length === 0 || isAnalyzing}
                    className="w-full px-4 py-2 font-bold text-black rounded-md transition-colors uppercase text-glow disabled:bg-gray-600/50 disabled:cursor-not-allowed disabled:text-gray-400 flex items-center justify-center"
                    style={{backgroundColor: '#ff00ff'}}
                >
                    {isAnalyzing && (
                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {isAnalyzing ? 'Analyzing...' : 'Get AI Insight'}
                </button>
            </div>
         </div>
      </Card>

      <Card>
          <div className="flex items-center justify-between mb-4">
             <h3 className="text-lg font-bold neon-cyan text-glow uppercase tracking-widest">
              // Bot Configuration
            </h3>
            <button 
              onClick={() => setInfoModalOpen(true)} 
              className="text-cyan-400 hover:text-cyan-200 transition-colors"
              aria-label="Strategy Information"
            >
              <InfoIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-4 md:space-y-0">
            <div>
                <label htmlFor="trade-amount" className="block text-sm font-medium text-cyan-400/80 uppercase tracking-wider mb-2">
                    // Trade Amount (SOL)
                </label>
                <input
                    type="number"
                    id="trade-amount"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    className="w-full md:w-48 bg-black/50 border border-cyan-400/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                    disabled={isBotEnabled}
                />
            </div>
            <div className="flex items-center space-x-4 pt-6">
                <span className={`text-sm uppercase font-bold ${!isBotEnabled ? 'text-gray-400' : 'neon-cyan'}`}>Enabled</span>
                    <label htmlFor="botToggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" id="botToggle" className="sr-only" checked={isBotEnabled} onChange={() => setIsBotEnabled(!isBotEnabled)}/>
                        <div className="block bg-gray-600/50 w-14 h-8 rounded-full border border-cyan-400/50"></div>
                        <div className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition-transform ${isBotEnabled ? 'translate-x-full bg-cyan-400' : 'bg-magenta-400'}`}
                                style={{backgroundColor: isBotEnabled ? '#00ffff' : '#ff00ff'}}></div>
                    </div>
                </label>
                <span className={`text-sm uppercase font-bold ${!isBotEnabled ? 'neon-magenta' : 'text-gray-400'}`}>Disabled</span>
            </div>
          </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Live Trade Feed">
            <div className="overflow-x-auto h-96">
                <table className="w-full text-left">
                    <thead className="text-xs text-cyan-400 uppercase sticky top-0 bg-black/50 backdrop-blur-sm">
                    <tr>
                        <th className="p-2 select-none">Pair</th>
                        <th className="p-2 select-none">Type</th>
                        <th className="p-2 select-none">Amount</th>
                        <th className="p-2 select-none">Price</th>
                    </tr>
                    </thead>
                    <tbody>
                    {liveTrades.length > 0 ? liveTrades.map(trade => (
                        <tr key={trade.id} className="border-b border-cyan-400/20 text-sm hover:bg-cyan-900/50 transition-colors animate-fadeIn">
                        <td className="p-2 font-bold">{trade.pair}</td>
                        <td className={`p-2 font-bold ${trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>{trade.type}</td>
                        <td className="p-2">{trade.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                        <td className="p-2 font-mono">${trade.price.toLocaleString(undefined, { maximumFractionDigits: 6 })}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="p-4 text-center text-gray-500 h-80 flex items-center justify-center">Awaiting new trades...</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </Card>
        <Card title="Activity Log">
            <div className="bg-black/50 p-3 rounded-md h-96 overflow-y-auto font-mono text-xs text-gray-300 flex flex-col-reverse">
                <div>
                  {logs.map((log, index) => (
                      <p key={index} className="animate-fadeIn">{`> ${log}`}</p>
                  ))}
                </div>
            </div>
        </Card>
      </div>

      <Modal
        isOpen={isInfoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        title="Copy Trading Strategy Explained"
      >
        <div className="text-gray-300 space-y-4">
            <div>
                <h4 className="font-bold neon-cyan text-md mb-1">// Wallet Scanning</h4>
                <p className="text-sm">The bot continuously monitors a curated list of high-performing Solana wallets for new transaction activity.</p>
            </div>
            <div>
                <h4 className="font-bold neon-cyan text-md mb-1">// Trade Replication</h4>
                <p className="text-sm">When a new BUY transaction is detected on one of these wallets, the bot instantly attempts to replicate the same trade on the corresponding token pair.</p>
            </div>
            <div>
                <h4 className="font-bold neon-cyan text-md mb-1">// Configured Amount</h4>
                <p className="text-sm">Each copy trade is executed using the precise SOL amount you have configured in the "Trade Amount" field, ensuring controlled risk and consistent investment size.</p>
            </div>
        </div>
      </Modal>
      <Modal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        title="Gemini AI Analysis"
      >
         {isAnalyzing ? (
            <div className="text-center p-8">
                <svg className="animate-spin mx-auto h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-cyan-300">Gemini is analyzing the data...</p>
            </div>
        ) : (
            <div className="text-gray-300 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                <div className="whitespace-pre-wrap font-mono text-sm">{aiInsight}</div>
            </div>
        )}
      </Modal>
    </div>
  );
};

export default CopyTradingHub;