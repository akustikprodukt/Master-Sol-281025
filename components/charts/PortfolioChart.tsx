import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PORTFOLIO_DATA } from '../../constants';
import Card from '../shared/Card';

const PortfolioChart: React.FC = () => {
  return (
    <Card title="Portfolio Performance">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={PORTFOLIO_DATA}
            margin={{
              top: 5,
              right: 20,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="1 4" stroke="rgba(0, 255, 255, 0.2)" />
            <XAxis dataKey="name" stroke="#00ffff" tick={{ fill: '#00ffff' }} />
            <YAxis stroke="#00ffff" tick={{ fill: '#00ffff' }} tickFormatter={(value) => `$${(Number(value) / 1000)}k`} />
            <Tooltip
                cursor={{ stroke: '#ff00ff', strokeWidth: 1, strokeDasharray: '3 3' }}
                contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid #00ffff',
                    fontFamily: "'Orbitron', sans-serif",
                }}
                labelStyle={{ color: '#00ffff' }}
            />
            <Legend wrapperStyle={{ color: '#E2E8F0' }}/>
            <Line type="monotone" dataKey="value" stroke="#00ffff" strokeWidth={2} activeDot={{ r: 8, stroke: '#ff00ff', fill: '#00ffff' }} dot={{fill: '#00ffff', stroke: '#00ffff'}}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PortfolioChart;
