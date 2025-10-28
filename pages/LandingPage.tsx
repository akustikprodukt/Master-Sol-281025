import React from 'react';
import SolanaIcon from '../components/icons/SolanaIcon';
import Card from '../components/shared/Card';

interface LandingPageProps {
  onLaunch: () => void;
}

const GlitchText: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="relative text-5xl md:text-7xl font-bold neon-cyan uppercase tracking-widest" data-text={text}>
            {text}
            <div className="absolute top-0 left-0 w-full h-full" style={{
                textShadow: '-2px 0 #ff00ff',
                clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
                animation: 'glitch-anim-1 4s infinite linear alternate-reverse'
            }}></div>
            <div className="absolute top-0 left-0 w-full h-full" style={{
                textShadow: '2px 0 #00ffff',
                clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)',
                animation: 'glitch-anim-2 4s infinite linear alternate-reverse'
            }}></div>
        </div>
    );
};

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1A] p-4">
       <style>{`
        @keyframes glitch-anim-1 {
            0% { clip-path: polygon(0 2%, 100% 2%, 100% 33%, 0 33%); }
            5% { clip-path: polygon(0 43%, 100% 43%, 100% 44%, 0 44%); }
            10% { clip-path: polygon(0 25%, 100% 25%, 100% 74%, 0 74%); }
            15% { clip-path: polygon(0 63%, 100% 63%, 100% 80%, 0 80%); }
            20% { clip-path: polygon(0 29%, 100% 29%, 100% 33%, 0 33%); }
            25% { clip-path: polygon(0 15%, 100% 15%, 100% 16%, 0 16%); }
            30% { clip-path: polygon(0 88%, 100% 88%, 100% 99%, 0 99%); }
            35% { clip-path: polygon(0 55%, 100% 55%, 100% 64%, 0 64%); }
            40% { clip-path: polygon(0 13%, 100% 13%, 100% 14%, 0 14%); }
            45% { clip-path: polygon(0 39%, 100% 39%, 100% 93%, 0 93%); }
            50% { clip-path: polygon(0 51%, 100% 51%, 100% 98%, 0 98%); }
            55% { clip-path: polygon(0 59%, 100% 59%, 100% 81%, 0 81%); }
            60% { clip-path: polygon(0 9%, 100% 9%, 100% 14%, 0 14%); }
            65% { clip-path: polygon(0 86%, 100% 86%, 100% 87%, 0 87%); }
            70% { clip-path: polygon(0 22%, 100% 22%, 100% 54%, 0 54%); }
            75% { clip-path: polygon(0 18%, 100% 18%, 100% 19%, 0 19%); }
            80% { clip-path: polygon(0 4%, 100% 4%, 100% 16%, 0 16%); }
            85% { clip-path: polygon(0 78%, 100% 78%, 100% 79%, 0 79%); }
            90% { clip-path: polygon(0 34%, 100% 34%, 100% 35%, 0 35%); }
            95% { clip-path: polygon(0 71%, 100% 71%, 100% 82%, 0 82%); }
            100% { clip-path: polygon(0 45%, 100% 45%, 100% 46%, 0 46%); }
        }
        @keyframes glitch-anim-2 { 0% { clip-path: polygon(0 69%, 100% 69%, 100% 71%, 0 71%); } 5% { clip-path: polygon(0 53%, 100% 53%, 100% 78%, 0 78%); } 10% { clip-path: polygon(0 45%, 100% 45%, 100% 96%, 0 96%); } 15% { clip-path: polygon(0 9%, 100% 9%, 100% 44%, 0 44%); } 20% { clip-path: polygon(0 80%, 100% 80%, 100% 81%, 0 81%); } 25% { clip-path: polygon(0 40%, 100% 40%, 100% 41%, 0 41%); } 30% { clip-path: polygon(0 23%, 100% 23%, 100% 24%, 0 24%); } 35% { clip-path: polygon(0 2%, 100% 2%, 100% 14%, 0 14%); } 40% { clip-path: polygon(0 89%, 100% 89%, 100% 90%, 0 90%); } 45% { clip-path: polygon(0 41%, 100% 41%, 100% 42%, 0 42%); } 50% { clip-path: polygon(0 61%, 100% 61%, 100% 62%, 0 62%); } 55% { clip-path: polygon(0 39%, 100% 39%, 100% 40%, 0 40%); } 60% { clip-path: polygon(0 3%, 100% 3%, 100% 4%, 0 4%); } 65% { clip-path: polygon(0 54%, 100% 54%, 100% 55%, 0 55%); } 70% { clip-path: polygon(0 26%, 100% 26%, 100% 27%, 0 27%); } 75% { clip-path: polygon(0 58%, 100% 58%, 100% 59%, 0 59%); } 80% { clip-path: polygon(0 68%, 100% 68%, 100% 69%, 0 69%); } 85% { clip-path: polygon(0 22%, 100% 22%, 100% 23%, 0 23%); } 90% { clip-path: polygon(0 84%, 100% 84%, 100% 85%, 0 85%); } 95% { clip-path: polygon(0 91%, 100% 91%, 100% 92%, 0 92%); } 100% { clip-path: polygon(0 75%, 100% 75%, 100% 76%, 0 76%); } }
       `}</style>
      <div className="w-full max-w-4xl text-center">
        <div className="flex items-center justify-center mb-6">
            <SolanaIcon className="w-16 h-16 md:w-24 md:h-24 text-cyan-400 text-glow" />
        </div>
        
        <h1 className="mb-4">
            <GlitchText text="Master-Sol" />
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            An advanced crypto forensics platform. Parse historical data, identify patterns, and gain actionable insights with Gemini-powered analysis.
        </p>

        <button
            onClick={onLaunch}
            className="w-full max-w-xs mx-auto bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-4 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 uppercase tracking-wider text-glow text-lg"
        >
            Launch Analysis Core
        </button>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-left">
                <h3 className="neon-cyan text-lg mb-2">// Structured Data</h3>
                <p className="text-sm text-gray-400">Analyze a database of past token events, from rug pulls to CEX listings.</p>
            </Card>
            <Card className="text-left">
                <h3 className="neon-cyan text-lg mb-2">// Gemini AI Analysis</h3>
                <p className="text-sm text-gray-400">Leverage Google's Gemini API to uncover hidden patterns and red flags.</p>
            </Card>
             <Card className="text-left">
                <h3 className="neon-cyan text-lg mb-2">// Actionable Insights</h3>
                <p className="text-sm text-gray-400">Get concise summaries and predictive indicators for future events.</p>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
