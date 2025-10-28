// FIX: Implement the main App component to structure the application and manage state.
import React, { useState } from 'react';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CopyTradingHub from './pages/CopyTradingHub';
import AdminPanel from './pages/AdminPanel';
import CryptoForensicsLab from './pages/CryptoForensicsLab';
import LandingPage from './pages/LandingPage';
import { User, Wallet } from './types';
import { MOCK_USERS, TEST_WALLET_BALANCE } from './constants';

export type Page = 'dashboard' | 'forensics' | 'bot' | 'admin';

const App: React.FC = () => {
  const [appState, setAppState] = useState<'landing' | 'login' | 'main'>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isTestMode, setTestMode] = useState(true);
  const [botPrivateKey, setBotPrivateKey] = useState<string>('');
  
  // State for bot wallet balances
  const [liveBotWalletBalance, setLiveBotWalletBalance] = useState<number>(5.0); // Initial live balance
  const [testBotWalletBalance, setTestBotWalletBalance] = useState<number>(TEST_WALLET_BALANCE);

  const handleLogin = (userId: number) => {
    const foundUser = MOCK_USERS.find(u => u.id === userId);
    if (foundUser) {
      setUser({ role: foundUser.role, address: foundUser.address });
      setAppState('main');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setWallet(null);
    setAppState('login');
    setCurrentPage('dashboard');
  };
  
  const handleConnect = () => {
      const loggedInUser = MOCK_USERS.find(u => u.address === user?.address);
      setWallet({
          address: loggedInUser?.address || '7xKMG8m6gC8qVbJ5qT9pW3fH9sY8Z2cE6d',
          balance: 10.53,
      });
  };

  const handleDisconnect = () => {
      setWallet(null);
      setTestMode(true);
  };
  
  if (appState === 'landing') {
    return <LandingPage onLaunch={() => setAppState('login')} />;
  }

  if (appState === 'login' || !user) {
    return <Login onLogin={handleLogin} />;
  }
  
  const botWalletBalance = isTestMode ? testBotWalletBalance : liveBotWalletBalance;
  const setBotWalletBalance = isTestMode ? setTestBotWalletBalance : setLiveBotWalletBalance;

  const renderPage = () => {
    switch(currentPage) {
        case 'dashboard':
            return <Dashboard wallet={wallet} isTestMode={isTestMode} botWalletBalance={botWalletBalance} />;
        case 'forensics':
            return <CryptoForensicsLab />;
        case 'bot':
            return <CopyTradingHub 
                        botPrivateKey={botPrivateKey} 
                        botWalletBalance={botWalletBalance}
                        setBotWalletBalance={setBotWalletBalance}
                    />;
        case 'admin':
            return <AdminPanel botPrivateKey={botPrivateKey} setBotPrivateKey={setBotPrivateKey} />;
        default:
            return <Dashboard wallet={wallet} isTestMode={isTestMode} botWalletBalance={botWalletBalance} />;
    }
  };

  return (
    <div className="flex h-screen bg-grid-cyan-500/10" style={{ background: "radial-gradient(circle at top left, #0A0F1A, #000)"}}>
      <style>{`
          .bg-grid-cyan-500\\/10 {
              background-image: linear-gradient(to right, rgba(0, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 255, 0.05) 1px, transparent 1px);
              background-size: 2rem 2rem;
          }
      `}</style>
      <Sidebar user={user} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={user} 
          wallet={wallet} 
          isTestMode={isTestMode} 
          setTestMode={setTestMode}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
          onLogout={handleLogout}
        />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;