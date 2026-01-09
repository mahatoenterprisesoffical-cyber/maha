
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; contact: string; pincode: string; requirement: string }) => void;
  itemName: string;
}

export const LeadModal: React.FC<LeadModalProps> = ({ isOpen, onClose, onSubmit, itemName }) => {
  const [formData, setFormData] = useState({ name: '', contact: '', pincode: '', requirement: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact || !formData.pincode) return;
    onSubmit(formData);
    setFormData({ name: '', contact: '', pincode: '', requirement: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100"
          >
            <div className="bg-[#001f3f] p-8 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-blue-400 font-black text-[10px] uppercase tracking-widest block mb-2">Requirement Inquiry</span>
                  <h3 className="text-2xl font-black uppercase tracking-tight">Express Interest</h3>
                  <p className="text-slate-400 text-sm mt-1">Item: <span className="text-white italic">{itemName}</span></p>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Full Name</label>
                  <input
                    required
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Pincode</label>
                  <input
                    required
                    type="text"
                    pattern="[0-9]{6}"
                    placeholder="400059"
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Contact Number</label>
                <input
                  required
                  type="tel"
                  placeholder="+91 00000 00000"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold transition-all"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Brief Requirement (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Tell us what you are looking for..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                  value={formData.requirement}
                  onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                />
              </div>
              <button 
                type="submit"
                className="w-full py-5 bg-[#001f3f] hover:bg-blue-900 text-white font-black rounded-2xl transition-all shadow-xl uppercase tracking-widest text-sm"
              >
                Proceed to WhatsApp <i className="fab fa-whatsapp ml-2"></i>
              </button>
              <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-wide italic">Your data is recorded for official follow-up.</p>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
