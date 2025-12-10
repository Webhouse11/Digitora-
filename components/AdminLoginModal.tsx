import React, { useState } from 'react';
import { X, Lock, Key } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded check for demonstration
    if (password === 'admin123') {
      onLogin();
      setPassword('');
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-brand-card border border-gold-500/30 w-full max-w-sm rounded-2xl p-8 shadow-2xl animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold-500/20">
            <Lock className="w-8 h-8 text-gold-400" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Admin Access</h2>
          <p className="text-gray-500 text-sm mt-2">Enter credentials to manage courses</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Password</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-gold-500 transition-colors"
                placeholder="••••••••"
                autoFocus
              />
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center bg-red-900/20 py-2 rounded">
              {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-400 text-black font-bold rounded hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all"
          >
            Access Dashboard
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-600">
          <p>Default Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginModal;