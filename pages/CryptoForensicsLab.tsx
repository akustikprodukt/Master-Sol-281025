import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import Card from '../components/shared/Card';
import Modal from '../components/shared/Modal';
import { AnalyzedToken, TokenEventType } from '../types';
import { MOCK_ANALYZED_TOKENS } from '../constants';

const generateMockTokenEvent = (): AnalyzedToken => {
    const prefixes = ['Cyber', 'Neon', 'Quantum', 'Astro', 'Glitch', 'Chrono', 'Synth', 'Void'];
    const suffixes = ['Coin', 'Protocol', 'Shard', 'Net', 'Fi', 'DAO', 'Link', 'Token'];
    const eventTypes = Object.values(TokenEventType);

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const name = `${prefix}${suffix}`;
    const symbol = name.substring(0, 3).toUpperCase() + (Math.random() > 0.5 ? name.charAt(3).toUpperCase() : '');
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const marketCap = Math.floor(Math.random() * 2000000000) + 50000;
    
    let description = '';
    const rugDescriptions = [
        'Newly detected contract with suspicious liquidity lock. High risk of rug pull.',
        'Deployer wallet rapidly selling off large token portions.',
        'Honeypot contract detected; sells are disabled for non-whitelisted wallets.',
        'Liquidity has been completely removed from the Raydium pool.'
    ];
    const pumpDescriptions = [
        'Significant abnormal volume increase detected across multiple exchanges.',
        'Coordinated buying activity from a cluster of new wallets.',
        'High-profile social media influencer mentioned the token.',
        'Unusual trading patterns suggest a pump and dump scheme.'
    ];
    const tier1Descriptions = [
        'Token has met criteria for Tier-1 status based on market cap and volume thresholds.',
        'Sustained organic growth and strong community engagement metrics.',
        'Partnership announced with a major established protocol.',
        'Added to multiple high-profile watchlists and analytics platforms.'
    ];
    const cexDescriptions = [
        'Strong rumors and on-chain movements suggest an imminent CEX listing.',
        'Large token transfers to a known CEX deposit wallet detected.',
        'API endpoints for the token have appeared on a major exchange.',
        'Official announcement of listing on a Tier-1 centralized exchange.'
    ];

    switch(eventType) {
        case TokenEventType.RugPull:
            description = rugDescriptions[Math.floor(Math.random() * rugDescriptions.length)];
            break;
        case TokenEventType.Pump:
            description = pumpDescriptions[Math.floor(Math.random() * pumpDescriptions.length)];
            break;
        case TokenEventType.Tier1:
            description = tier1Descriptions[Math.floor(Math.random() * tier1Descriptions.length)];
            break;
        case TokenEventType.CEXListing:
            description = cexDescriptions[Math.floor(Math.random() * cexDescriptions.length)];
            break;
    }

    return {
        id: `A${Date.now()}${Math.random()}`,
        name,
        symbol,
        eventType,
        description,
        date: new Date().toISOString().split('T')[0],
        marketCap,
    };
};


const CryptoForensicsLab: React.FC = () => {
    const [tokens, setTokens] = useState<AnalyzedToken[]>(MOCK_ANALYZED_TOKENS);
    const [filter, setFilter] = useState<TokenEventType | 'All'>('All');
    const [newTokenId, setNewTokenId] = useState<string | null>(null);
    const MAX_TOKENS = 20;
    
    const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false);
    const [selectedToken, setSelectedToken] = useState<AnalyzedToken | null>(null);
    const [analysisResult, setAnalysisResult] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        let timeoutId: number;

        const scheduleNextEvent = () => {
            // Generate a random interval between 2 and 5 seconds to feel more organic
            const randomInterval = Math.random() * 3000 + 2000; 

            timeoutId = window.setTimeout(() => {
                const newToken = generateMockTokenEvent();
                setTokens(currentTokens => [newToken, ...currentTokens].slice(0, MAX_TOKENS));
                setNewTokenId(newToken.id);
                
                // Keep the highlight for 1.5 seconds
                setTimeout(() => setNewTokenId(null), 1500);
                
                // Schedule the next event
                scheduleNextEvent();
            }, randomInterval);
        };

        scheduleNextEvent();

        // Cleanup function to clear the timeout when the component unmounts
        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    const handleAnalyzeClick = async (token: AnalyzedToken) => {
        setSelectedToken(token);
        setAnalysisModalOpen(true);
        setIsAnalyzing(true);
        setAnalysisResult('');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Analyze the following cryptocurrency event based on the provided data. 
                Identify and summarize the key factors, on-chain signals, and market sentiment patterns that likely contributed to this outcome. 
                Provide actionable insights or red flags that could help in predicting or identifying similar events in the future.

                - Token Name: ${token.name} (${token.symbol})
                - Event Type: ${token.eventType}
                - Event Date: ${token.date}
                - Peak Market Cap: $${token.marketCap.toLocaleString()}
                - Description: ${token.description}

                Structure your analysis into "Key Factors" and "Actionable Insights / Red Flags".
                Your analysis should be concise and easy to understand for a crypto analyst.
            `;
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setAnalysisResult(response.text);
        } catch (error) {
            console.error("Gemini API error:", error);
            setAnalysisResult("Error: Could not retrieve analysis. The AI subsystem may be offline. Check console for details.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const filteredTokens = useMemo(() => {
        if (filter === 'All') return tokens;
        return tokens.filter(token => token.eventType === filter);
    }, [tokens, filter]);
    
    const eventTypeColors: { [key in TokenEventType]: string } = {
        [TokenEventType.RugPull]: 'bg-red-500/20 text-red-300',
        [TokenEventType.Pump]: 'bg-yellow-500/20 text-yellow-300',
        [TokenEventType.Tier1]: 'bg-green-500/20 text-green-300',
        [TokenEventType.CEXListing]: 'bg-blue-500/20 text-blue-300',
    };

    const FilterButton: React.FC<{ value: TokenEventType | 'All', label: string }> = ({ value, label }) => (
        <button 
            onClick={() => setFilter(value)}
            className={`px-4 py-2 text-sm font-bold uppercase rounded-md transition-all ${filter === value ? 'bg-cyan-500 text-black' : 'bg-black/30 border border-cyan-400/50 hover:bg-cyan-900/50'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-6">
            <Card title="Crypto Event Database & Forensics">
                <p className="text-sm text-gray-400 mb-4">
                    Analyze historical data of past crypto events. Use the Gemini AI to extract patterns and actionable insights.
                </p>
                <div className="flex space-x-2 mb-4">
                    <FilterButton value="All" label="All" />
                    <FilterButton value={TokenEventType.RugPull} label="Rug Pulls" />
                    <FilterButton value={TokenEventType.Pump} label="Pumps" />
                    <FilterButton value={TokenEventType.Tier1} label="Tier-1" />
                    <FilterButton value={TokenEventType.CEXListing} label="CEX Listings" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs text-cyan-400 uppercase">
                            <tr>
                                {['Token', 'Event Type', 'Date', 'Market Cap', 'Actions'].map(key => (
                                    <th key={key} className="p-3 select-none">{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTokens.map(token => (
                                <tr key={token.id} className={`border-b border-cyan-400/20 hover:bg-cyan-900/50 transition-colors duration-300 ${token.id === newTokenId ? 'bg-cyan-900' : ''}`}>
                                    <td className="p-3 text-sm font-bold">{token.name} <span className="text-gray-400">({token.symbol})</span></td>
                                    <td className="p-3 text-sm">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${eventTypeColors[token.eventType]}`}>{token.eventType}</span>
                                    </td>
                                    <td className="p-3 text-sm text-gray-400 font-mono">{token.date}</td>
                                    <td className="p-3 text-sm font-mono">${token.marketCap.toLocaleString()}</td>
                                    <td className="p-3 text-sm">
                                        <button 
                                            onClick={() => handleAnalyzeClick(token)}
                                            className="px-3 py-1 font-bold text-black bg-cyan-500 rounded-md hover:bg-cyan-400 transition-colors text-xs uppercase"
                                        >
                                            Analyze
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            
            <Modal
                isOpen={isAnalysisModalOpen}
                onClose={() => setAnalysisModalOpen(false)}
                title={`AI Analysis: ${selectedToken?.name || ''}`}
            >
                {isAnalyzing ? (
                    <div className="text-center p-8">
                         <svg className="animate-spin mx-auto h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-cyan-300">Gemini is analyzing the data...</p>
                    </div>
                ) : (
                    <div className="text-gray-300 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                       <div className="whitespace-pre-wrap font-mono text-sm">{analysisResult}</div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CryptoForensicsLab;