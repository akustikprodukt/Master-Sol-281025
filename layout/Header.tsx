import React, { useState, useEffect, useRef } from 'react';
import { User, Wallet } from '../types';
import LogoutIcon from '../components/icons/LogoutIcon';

interface HeaderProps {
  user: User | null;
  wallet: Wallet | null;
  isTestMode: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  setTestMode: (isTest: boolean) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, wallet, onConnect, onDisconnect, isTestMode, setTestMode, onLogout }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const prevWalletRef = useRef<Wallet | null>(wallet);

  useEffect(() => {
    if (!prevWalletRef.current && wallet) { // Just connected
      setIsConnecting(false);
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
    prevWalletRef.current = wallet;
  }, [wallet]);
  
  const handleConnectClick = () => {
    setIsConnecting(true);
    setTimeout(() => {
      onConnect();
    }, 1500); // Simulate connection time
  };

  const renderWalletStatus = () => {
    if (isConnecting) {
      return (
        <button disabled className="px-4 py-2 font-bold text-black bg-cyan-400/50 rounded-md uppercase text-glow flex items-center cursor-not-allowed">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        </button>
      );
    }

    if (wallet && user) {
      if (showSuccess) {
        return (
          <div className="px-4 py-2 font-bold text-black bg-green-500 rounded-md uppercase text-glow animate-pulse">
            Wallet Connected!
          </div>
        );
      }
      return (
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="font-mono text-sm neon-cyan">{`Agent ${wallet.address.substring(0, 4)}...${wallet.address.substring(wallet.address.length - 4)}`}</p>
            <p className="text-xs font-bold text-gray-300">{wallet.balance.toFixed(2)} SOL</p>
          </div>
          <button onClick={onDisconnect} className="px-3 py-2 text-xs font-bold text-black bg-magenta-500 rounded-md hover:bg-magenta-600 transition-all uppercase hover:brightness-110" style={{backgroundColor: '#ff00ff'}}>
            Disconnect
          </button>
        </div>
      );
    }
    
    return (
      <button onClick={handleConnectClick} className="px-4 py-2 font-bold text-black bg-cyan-400 rounded-md hover:bg-cyan-300 transition-colors uppercase text-glow">
        Connect Wallet
      </button>
    );
  };

  return (
    <header className="bg-black/20 backdrop-blur-sm border-b border-cyan-400/30 p-4 flex justify-between items-center">
        <div>
            {user && <p className="text-sm text-gray-400">Welcome, Agent <span className="font-bold neon-cyan">{user.role}</span></p>}
        </div>
        <div className="flex items-center space-x-4 md:space-x-6">
            <div className="flex items-center space-x-3">
                <span className={`text-xs uppercase font-bold ${isTestMode ? 'text-gray-400' : 'neon-cyan'}`}>Live</span>
                    <label htmlFor="testModeToggle" className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" id="testModeToggle" className="sr-only" checked={isTestMode} onChange={(e) => setTestMode(e.target.checked)} disabled={!wallet}/>
                        <div className="block bg-gray-600/50 w-14 h-8 rounded-full border border-cyan-400/50"></div>
                        <div className={`dot absolute left-1 top-1 w-6 h-6 rounded-full transition-transform ${isTestMode ? 'translate-x-full bg-magenta-400' : 'bg-cyan-400'}`}
                                style={{backgroundColor: isTestMode ? '#ff00ff' : '#00ffff'}}></div>
                    </div>
                </label>
                <span className={`text-xs uppercase font-bold ${isTestMode ? 'neon-magenta' : 'text-gray-400'}`}>Test</span>
            </div>
        
            {renderWalletStatus()}
            
            <button
                onClick={onLogout}
                className="p-2 rounded-full hover:bg-cyan-500/20 transition-colors duration-200"
                aria-label="Logout"
            >
                <LogoutIcon className="w-6 h-6 text-cyan-400" />
            </button>
        </div>
    </header>
  );
};

export default Header;
