
import React, { useState } from 'react';
/* Added Variants import to fix type incompatibility */
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { CompanyInfo } from '../types';

interface SidebarElementsProps {
  company: CompanyInfo;
}

export const SidebarElements: React.FC<SidebarElementsProps> = ({ company }) => {
  const [showQR, setShowQR] = useState(false);

  /* Added Variants type to buttonVariants to ensure compatibility with motion components and fix inference issues */
  const buttonVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.5 + i * 0.1,
        /* Cast to const to satisfy AnimationGeneratorType literal requirement */
        type: "spring" as const,
        stiffness: 260,
        damping: 20
      }
    }),
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, -10, 0],
      transition: { duration: 0.4 }
    }
  };

  const menuItems = [
    { 
      icon: 'fab fa-whatsapp', 
      color: 'bg-green-500', 
      link: company.whatsappQrLink, 
      label: 'Direct WhatsApp',
      secondaryAction: () => setShowQR(true),
      secondaryIcon: 'fa-qrcode'
    },
    { icon: 'fas fa-envelope', color: 'bg-amber-500', link: `mailto:${company.email}`, label: 'Email' }
  ];

  return (
    <>
      <div className="fixed right-6 bottom-1/2 translate-y-1/2 flex flex-col space-y-5 z-40">
        {menuItems.map((btn, i) => (
          <motion.div
            key={i}
            custom={i}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={buttonVariants}
            className="relative group"
          >
            <div className="flex items-center gap-2">
               {/* Label (Hidden by default) */}
               <span className="absolute right-20 top-1/2 -translate-y-1/2 bg-white text-slate-800 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity border border-slate-200 shadow-xl pointer-events-none whitespace-nowrap">
                 {btn.label}
               </span>

               {/* Secondary Action (QR View) for WhatsApp only */}
               {btn.secondaryAction && (
                 <button
                   onClick={(e) => { e.stopPropagation(); btn.secondaryAction?.(); }}
                   className="absolute -left-12 opacity-0 group-hover:opacity-100 transition-all w-10 h-10 bg-slate-800 text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110"
                   title="View QR Code"
                 >
                   <i className={`fas ${btn.secondaryIcon} text-xs`}></i>
                 </button>
               )}

               {/* Main Link Button */}
               <a 
                href={btn.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`w-16 h-16 ${btn.color} text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20 hover:shadow-black/40 transition-shadow`}
               >
                  <i className={`${btn.icon} text-2xl`}></i>
               </a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* WhatsApp QR Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-[#111b21] max-w-sm w-full rounded-[3rem] p-8 relative shadow-2xl overflow-hidden border border-slate-800"
            >
               <div className="flex items-center justify-between mb-10 text-white border-b border-slate-700 pb-6">
                 <div className="flex items-center gap-4">
                    <button onClick={() => setShowQR(false)} className="hover:text-green-400 transition-colors">
                      <i className="fas fa-arrow-left text-lg"></i>
                    </button>
                    <h3 className="text-xl font-black uppercase tracking-widest text-green-400">Scan QR</h3>
                 </div>
               </div>

               <div className="flex flex-col items-center bg-[#1f2c34] rounded-[2.5rem] py-16 px-10 relative">
                  <h4 className="text-white text-2xl font-black mt-2 tracking-tight uppercase">Mahato Tech</h4>
                  <p className="text-slate-400 text-xs font-bold mb-10 italic">Instant Connect</p>

                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-5 rounded-[2.5rem] shadow-2xl border-4 border-slate-200"
                  >
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(company.whatsappQrLink)}`} 
                        alt="WhatsApp QR" 
                        className="w-48 h-48"
                      />
                  </motion.div>
               </div>

               <button 
                  onClick={() => setShowQR(false)}
                  className="mt-10 w-full py-5 bg-green-500 hover:bg-green-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-green-900/40 uppercase tracking-[0.2em] text-sm"
               >
                  Dismiss
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
