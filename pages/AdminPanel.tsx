// FIX: Implement the AdminPanel page component.
import React, { useState } from 'react';
import Card from '../components/shared/Card';
import InfoIcon from '../components/icons/InfoIcon';

interface AdminPanelProps {
  botPrivateKey: string;
  setBotPrivateKey: (key: string) => void;
}

type ApiStatus = 'idle' | 'checking' | 'success' | 'error';
interface ApiStatuses {
  [key: string]: ApiStatus;
}
interface ApiKeys {
  [key: string]: string;
}

const API_SERVICES = [
    { id: 'solana', name: 'Solana RPC Endpoint' },
    { id: 'jupiter', name: 'Jupiter API Key' },
    { id: 'birdeye', name: 'Birdeye API Key' },
    { id: 'rugcheck', name: 'Rug Check Service API' }
];

const AdminPanel: React.FC<AdminPanelProps> = ({ botPrivateKey, setBotPrivateKey }) => {
  const [keyInput, setKeyInput] = useState(botPrivateKey);
  const [feedback, setFeedback] = useState('');
  
  const [apiKeys, setApiKeys] = useState<ApiKeys>({ solana: '', jupiter: '', birdeye: '', rugcheck: '' });
  const [apiStatuses, setApiStatuses] = useState<ApiStatuses>({ solana: 'idle', jupiter: 'idle', birdeye: 'idle', rugcheck: 'idle' });

  const handleSave = () => {
    setBotPrivateKey(keyInput);
    setFeedback('Configuration saved successfully.');
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleApiInputChange = (id: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [id]: value }));
    setApiStatuses(prev => ({ ...prev, [id]: 'idle' }));
  };
  
  const handleCheckApis = () => {
    const checkingStatuses: ApiStatuses = {};
    API_SERVICES.forEach(api => checkingStatuses[api.id] = 'checking');
    setApiStatuses(checkingStatuses);

    API_SERVICES.forEach(api => {
        setTimeout(() => {
            const isSuccess = Math.random() > 0.25; // 75% chance of success
            setApiStatuses(prev => ({
                ...prev,
                [api.id]: isSuccess ? 'success' : 'error'
            }));
        }, Math.random() * 1500 + 500);
    });
  };

  const StatusIndicator: React.FC<{ status: ApiStatus }> = ({ status }) => {
    const statusConfig = {
      idle: { class: 'bg-gray-500/50', title: 'Idle' },
      checking: { class: 'bg-cyan-500 animate-pulse', title: 'Checking...' },
      success: { class: 'bg-green-500', title: 'Connection OK' },
      error: { class: 'bg-red-500', title: 'Connection Failed' },
    };
    return <div className={`w-4 h-4 rounded-full ${statusConfig[status].class} transition-colors`} title={statusConfig[status].title}></div>;
  };

  return (
    <div className="space-y-6">
      <Card title="Admin Panel // System Configuration">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Wallet Configuration */}
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-bold neon-magenta mb-2 uppercase tracking-wider">// Bot Wallet Configuration</h4>
                <p className="text-sm text-gray-400 mb-4">
                  Enter the private key for the copy trading bot wallet. This key is stored locally in your browser's state and is not transmitted anywhere.
                </p>
                <div className="flex items-start bg-yellow-900/20 border border-yellow-500/50 text-yellow-300 p-3 rounded-md text-sm">
                  <InfoIcon className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong>Security Warning:</strong> Never expose this private key. Anyone with this key can access the wallet's funds. Use a dedicated, funded bot wallet, not your primary wallet.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="private-key" className="block text-sm font-medium text-cyan-400/80 uppercase tracking-wider">
                  // Bot Wallet Private Key
                </label>
                <input
                  type="password"
                  id="private-key"
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  placeholder="Enter private key here"
                  className="w-full bg-black/50 border border-cyan-400/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                />
              </div>

              <div>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 font-bold text-black bg-cyan-500 rounded-md hover:bg-cyan-400 transition-colors uppercase text-glow"
                >
                  Save Configuration
                </button>
                {feedback && <p className="text-green-400 text-sm mt-2 animate-pulse">{feedback}</p>}
              </div>
            </div>

            {/* API Configuration */}
            <div className="space-y-6">
                <div>
                    <h4 className="text-md font-bold neon-magenta mb-2 uppercase tracking-wider">// API Configuration Matrix</h4>
                    <p className="text-sm text-gray-400 mb-4">
                        Enter and verify your API keys for all required external services.
                    </p>
                </div>
                <div className="space-y-4">
                    {API_SERVICES.map(api => (
                        <div key={api.id}>
                            <label htmlFor={api.id} className="block text-sm font-medium text-cyan-400/80 uppercase tracking-wider mb-1">
                                // {api.name}
                            </label>
                            <div className="flex items-center space-x-2">
                                <input
                                type="text"
                                id={api.id}
                                value={apiKeys[api.id]}
                                onChange={(e) => handleApiInputChange(api.id, e.target.value)}
                                placeholder={`Enter ${api.name}`}
                                className="w-full bg-black/50 border border-cyan-400/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                                />
                                <StatusIndicator status={apiStatuses[api.id]} />
                            </div>
                        </div>
                    ))}
                </div>
                 <div>
                    <button
                        onClick={handleCheckApis}
                        className="px-4 py-2 font-bold text-black bg-magenta-500 rounded-md hover:bg-magenta-400 transition-colors uppercase text-glow"
                        style={{backgroundColor: '#ff00ff'}}
                    >
                        Check API Status
                    </button>
                </div>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminPanel;