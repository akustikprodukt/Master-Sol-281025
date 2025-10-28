import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div 
      className={`relative bg-black/30 backdrop-blur-sm border border-cyan-400/50 p-4 md:p-6 shadow-lg shadow-cyan-500/10 ${className}`}
      style={{
        clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
      }}
    >
      <div className="absolute inset-0 border-2 border-cyan-400/50 pointer-events-none" style={{
        clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
        animation: 'pulse-border 3s infinite',
      }}></div>
      <style>{`
        @keyframes pulse-border {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
      `}</style>

      {title && (
        <h3 className="text-lg font-bold neon-cyan mb-4 text-glow uppercase tracking-widest">
          // {title}
        </h3>
      )}
      {children}
    </div>
  );
};

export default Card;
