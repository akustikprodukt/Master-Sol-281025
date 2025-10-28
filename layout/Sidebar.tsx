import React from 'react';
import SolanaIcon from '../components/icons/SolanaIcon';
import DashboardIcon from '../components/icons/DashboardIcon';
import BotIcon from '../components/icons/BotIcon';
import AdminIcon from '../components/icons/AdminIcon';
import { User } from '../types';
// FIX: Import Page type from App.tsx to resolve module error.
import { Page } from '../App';
import InfoIcon from '../components/icons/InfoIcon';

interface SidebarProps {
  user: User | null;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center p-3 my-1 rounded-md transition-all duration-200 text-left ${
      isActive
        ? 'bg-cyan-500/30 text-cyan-300 font-bold'
        : 'text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-400'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <Icon className="w-6 h-6 mr-3" />
    <span className="uppercase tracking-wider text-sm">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ user, currentPage, setCurrentPage }) => {
  return (
    <aside className="w-64 bg-black/30 backdrop-blur-sm border-r border-cyan-400/30 flex-col p-4 hidden md:flex">
      <div className="flex items-center mb-10 p-2">
        <SolanaIcon className="w-10 h-10 text-cyan-400 text-glow" />
        <h1 className="ml-3 text-2xl font-bold text-white text-glow neon-cyan">Master-Sol</h1>
      </div>
      
      <nav className="flex-1">
        <NavItem
          icon={DashboardIcon}
          label="Dashboard"
          isActive={currentPage === 'dashboard'}
          onClick={() => setCurrentPage('dashboard')}
        />
        {/* FIX: Add Crypto Forensics Lab to navigation to make it accessible */}
        <NavItem
          icon={InfoIcon}
          label="Forensics Lab"
          isActive={currentPage === 'forensics'}
          onClick={() => setCurrentPage('forensics')}
        />
        <NavItem
          icon={BotIcon}
          label="Copy Trading"
          isActive={currentPage === 'bot'}
          onClick={() => setCurrentPage('bot')}
        />
        <NavItem
          icon={AdminIcon}
          label="Admin Panel"
          isActive={currentPage === 'admin'}
          onClick={() => setCurrentPage('admin')}
          disabled={user?.role !== 'Admin'}
        />
      </nav>

      <div className="mt-auto text-center text-xs text-gray-500">
        <p>Master-Sol v1.0.0</p>
        <p>&copy; 2024 Cyberdyne Systems</p>
      </div>
    </aside>
  );
};

export default Sidebar;
