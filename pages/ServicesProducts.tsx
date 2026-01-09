
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Service, CompanyInfo, Lead } from '../types';
import { LeadModal } from '../components/LeadModal';

interface ServicesProductsProps {
  services: Service[];
  company: CompanyInfo;
  addLead: (lead: Omit<Lead, 'id' | 'timestamp'>) => void;
}

export const ServicesProducts: React.FC<ServicesProductsProps> = ({ services, company, addLead }) => {
  const [filter, setFilter] = useState<'All' | 'Service' | 'Product'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Service | null>(null);

  const filteredItems = filter === 'All' 
    ? services 
    : services.filter(s => s.category === filter);

  const formatPrice = (price?: string) => {
    if (!price) return "Contact Us";
    if (price.startsWith('\u20B9')) return price;
    if (!isNaN(Number(price))) return `\u20B9${price}`;
    return price;
  };

  const handleInquiryStart = (item: Service) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleLeadSubmit = (data: { name: string; contact: string; pincode: string; requirement: string }) => {
    if (!selectedItem) return;

    // 1. Record lead in system
    addLead({
      userName: data.name,
      contactNumber: data.contact,
      pincode: data.pincode,
      requirement: data.requirement,
      itemName: selectedItem.name
    });

    // 2. Build and launch WhatsApp message
    const message = encodeURIComponent(
      `Mahato Tech Inquiry:\n` +
      `Item: ${selectedItem.name}\n` +
      `Price Ref: ${selectedItem.price || 'N/A'}\n` +
      `Customer: ${data.name}\n` +
      `Contact: ${data.contact}\n` +
      `Pincode: ${data.pincode}\n` +
      `Req: ${data.requirement || 'Standard Inquiry'}`
    );
    window.open(`https://wa.me/${company.whatsappNumber}?text=${message}`, '_blank');
    setIsModalOpen(false);
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <LeadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleLeadSubmit}
        itemName={selectedItem?.name || ''}
      />

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-slate-200 pb-10"
      >
        <div>
          <h2 className="text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Inventory & Skills</h2>
          <p className="text-lg text-slate-400 font-medium">Explore professional hardware solutions and certified repair expertise.</p>
        </div>
        
        <div className="flex p-1.5 bg-slate-200/50 backdrop-blur-md rounded-2xl border border-slate-200">
          {(['All', 'Service', 'Product'] as const).map((type) => (
            <motion.button
              key={type}
              onClick={() => setFilter(type)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                filter === type 
                  ? 'bg-[#001f3f] text-white shadow-xl shadow-blue-900/30' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {type}s
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
      >
        <AnimatePresence>
          {filteredItems.map((item, index) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="group bg-white rounded-[3rem] overflow-hidden shadow-xl hover:shadow-3xl transition-all duration-500 border border-slate-100 flex flex-col h-full"
            >
              <div className="relative h-72 overflow-hidden">
                <motion.img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6">
                  <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                    item.category === 'Service' ? 'bg-blue-600 text-white' : 'bg-[#ff9900] text-white'
                  }`}>
                    {item.category}
                  </span>
                </div>
              </div>
              
              <div className="p-10 flex flex-col flex-grow">
                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                  {item.name}
                </h3>
                <p className="text-slate-500 mb-8 flex-grow leading-relaxed font-medium italic">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-8 border-t border-slate-50">
                  <span className="text-3xl font-black text-[#001f3f]">
                    {formatPrice(item.price)}
                  </span>
                  <motion.button 
                    onClick={() => handleInquiryStart(item)}
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 bg-slate-100 hover:bg-green-500 hover:text-white rounded-2xl transition-all flex items-center justify-center text-xl shadow-sm cursor-pointer"
                    title="Inquiry"
                  >
                    <i className="fas fa-arrow-right"></i>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center py-32 bg-slate-50 border-4 border-dashed border-slate-200 rounded-[4rem]"
          >
            <i className="fas fa-search text-6xl text-slate-200 mb-6"></i>
            <p className="text-slate-400 text-xl font-black uppercase tracking-widest">No matching results found.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
