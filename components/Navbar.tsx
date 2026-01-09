
import React from 'react';
import { motion } from 'framer-motion';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  logoUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage, logoUrl }) => {
  const displayLogo = logoUrl || "https://i.ibb.co/L5QGv0P/mahato-logo.png";
  
  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'Services & Products', id: 'services' },
    { name: 'Admin Panel', id: 'admin' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            className="flex items-center cursor-pointer group" 
            onClick={() => setCurrentPage('home')}
          >
            <div className="relative h-16 w-auto flex items-center">
              <img 
                src={displayLogo} 
                alt="Mahato Logo" 
                className="h-full w-auto object-contain transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(30,58,138,0.2)]"
              />
            </div>
          </motion.div>
          
          <div className="flex space-x-2">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  currentPage === item.id
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {item.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
