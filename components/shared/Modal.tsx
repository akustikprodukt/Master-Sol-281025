import React from 'react';
import Card from './Card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
    >
      <style>{`@keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }`}</style>
      <div 
        className="w-full max-w-2xl m-4"
        onClick={e => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <Card title={title} className="relative">
           <button 
             onClick={onClose} 
             className="absolute top-4 right-4 text-gray-400 hover:text-cyan-300 transition-colors"
             aria-label="Close modal"
           >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
           </button>
          {children}
        </Card>
      </div>
    </div>
  );
};

export default Modal;
