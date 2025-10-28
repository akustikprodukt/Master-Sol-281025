import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import SolanaIcon from '../components/icons/SolanaIcon';
import Card from '../components/shared/Card';

interface LoginProps {
  onLogin: (userId: number) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(MOCK_USERS[0].id.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserId) {
      onLogin(parseInt(selectedUserId, 10));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1A] p-4">
      <div className="w-full max-w-md">
        <Card>
          <div className="flex items-center justify-center mb-8">
            <SolanaIcon className="w-12 h-12 text-cyan-400 text-glow" />
            <h1 className="ml-4 text-3xl font-bold text-white text-glow neon-cyan">Master-Sol</h1>
          </div>
          <h2 className="text-center text-xl text-gray-300 mb-6 uppercase tracking-widest">System Access</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="user-select" className="block text-sm font-medium text-cyan-400/80 mb-2">
                // SELECT AGENT ID
              </label>
              <select
                id="user-select"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full bg-black/50 border border-cyan-400/50 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {MOCK_USERS.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} // {user.role}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-cyan-400/80 mb-2" htmlFor="password">
                // PASSCODE
              </label>
              <input
                className="w-full bg-black/50 border border-cyan-400/50 text-white rounded-md px-3 py-2"
                id="password"
                type="password"
                placeholder="************"
                value="dummypassword"
                readOnly
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 uppercase tracking-wider text-glow"
            >
              Initiate Link
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
