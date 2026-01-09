
import React, { useState, useEffect } from 'react';
/* Added Variants import to fix type incompatibility with motion components */
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { CompanyInfo, Lead } from '../types';
import { LeadModal } from '../components/LeadModal';

interface HomeProps {
  company: CompanyInfo;
  setCurrentPage: (page: string) => void;
  addLead: (lead: Omit<Lead, 'id' | 'timestamp'>) => void;
}

const BANNER_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1664392437637-29676771e780?q=80&w=2070&auto=format&fit=crop", // Placeholder for provided Repair Image
    title: "Expert Repair Center",
    subtitle: "Precision chip-level repairs by certified Mahato technicians. We bring your tech back to life."
  },
  {
    image: "https://images.unsplash.com/photo-1543362906-acfc16c67564?q=80&w=2070&auto=format&fit=crop", // Placeholder for Festive/Offer Image
    title: "Festive Tech Deals",
    subtitle: "Celebrate Makar Sankranti with high-flying offers on business laptops and professional hardware."
  },
  {
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
    title: "Enterprise IT Solutions",
    subtitle: "Scalable infrastructure and dedicated support for Mumbai's growing business landscape."
  }
];

export const Home: React.FC<HomeProps> = ({ company, setCurrentPage, addLead }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("General Support/Repair");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  /* Added Variants type to containerVariants to ensure proper property validation */
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  /* Added Variants type and cast ease to literal string to satisfy Easing type requirement */
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  const handleLeadSubmit = (data: { name: string; contact: string; pincode: string; requirement: string }) => {
    // 1. Record lead
    addLead({
      userName: data.name,
      contactNumber: data.contact,
      pincode: data.pincode,
      requirement: data.requirement,
      itemName: selectedItem
    });

    // 2. WhatsApp Redirect
    const message = encodeURIComponent(
      `Mahato Tech Inquiry:\n` +
      `Name: ${data.name}\n` +
      `Contact: ${data.contact}\n` +
      `Pincode: ${data.pincode}\n` +
      `Requirement for: ${selectedItem}\n` +
      `Message: ${data.requirement || 'I need support/repair.'}`
    );
    window.open(`https://wa.me/${company.whatsappNumber}?text=${message}`, '_blank');
    setIsModalOpen(false);
  };

  const openInquiry = (itemLabel: string) => {
    setSelectedItem(itemLabel);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <LeadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleLeadSubmit}
        itemName={selectedItem}
      />

      {/* Sliding Banner Section */}
      <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img 
              src={BANNER_SLIDES[currentSlide].image} 
              alt="Banner" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
              <motion.h2 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-glow"
              >
                {BANNER_SLIDES[currentSlide].title}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-slate-200 text-lg md:text-xl font-medium max-w-2xl"
              >
                {BANNER_SLIDES[currentSlide].subtitle}
              </motion.p>
              
              {currentSlide === 1 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => openInquiry("Makar Sankranti Offer")}
                  className="mt-8 px-8 py-4 bg-[#ff9900] text-white font-black rounded-full shadow-2xl uppercase tracking-widest text-xs"
                >
                  Get Special Offer
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {BANNER_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === i ? 'w-12 bg-blue-500' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Two Blocks Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-40 mb-24">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div 
            whileHover={{ y: -10 }}
            className="group relative h-[350px] rounded-[3rem] overflow-hidden shadow-2xl cursor-pointer border border-white/20"
            onClick={() => openInquiry('Technical Services')}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-900/40 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=1000&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              alt="Services" 
            />
            <div className="absolute inset-0 z-20 p-12 flex flex-col justify-end">
              <span className="text-blue-400 font-black text-xs uppercase tracking-[0.3em] mb-4">Our Expertise</span>
              <h3 className="text-white text-4xl font-black uppercase tracking-tight mb-2">Technical Services</h3>
              <p className="text-slate-300 font-medium mb-6 line-clamp-2">Chip-level repairs, network optimization, and professional maintenance for enterprise systems.</p>
              <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-widest">
                Explore Services <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="group relative h-[350px] rounded-[3rem] overflow-hidden shadow-2xl cursor-pointer border border-white/20"
            onClick={() => setCurrentPage('services')}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-orange-900 via-orange-900/40 to-transparent z-10" />
            <img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              alt="Products" 
            />
            <div className="absolute inset-0 z-20 p-12 flex flex-col justify-end">
              <span className="text-orange-400 font-black text-xs uppercase tracking-[0.3em] mb-4">Hardware Inventory</span>
              <h3 className="text-white text-4xl font-black uppercase tracking-tight mb-2">Quality Products</h3>
              <p className="text-slate-300 font-medium mb-6 line-clamp-2">Premium business laptops, workstations, and authentic spare parts with full warranty support.</p>
              <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-widest">
                View Catalog <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-24 px-4 bg-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50 blur-[120px] rounded-full -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-50 blur-[120px] rounded-full -z-10" />
        
        <motion.div 
          className="max-w-6xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="inline-block bg-blue-50 px-6 py-2 rounded-full border border-blue-100 mb-10">
            <span className="text-blue-600 font-black tracking-[0.4em] text-[10px] uppercase">Official Business Portal</span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase mb-8"
          >
            Powering Mumbai's <span className="text-blue-600">Digital Transformation</span>
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-slate-500 font-medium max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            Mahato Enterprises delivers unmatched reliability in IT services. We provide GST-ready hardware solutions and expert maintenance for corporate and individual clients across the region.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex justify-center gap-6">
            <button 
              onClick={() => openInquiry("Repair Support")}
              className="px-10 py-5 bg-[#001f3f] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-900 transition-all shadow-xl"
            >
              Contact Support
            </button>
          </motion.div>
        </motion.div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { icon: 'fa-building', title: 'Corporate Hub', text: company.address, color: 'blue' },
            { icon: 'fa-headset', title: '24/7 Priority', text: `Direct: ${company.phone}`, color: 'orange', sub: company.email },
            { icon: 'fa-certificate', title: 'Tax Benefits', text: 'Verified B2B Vendor for Corporate Procurements', color: 'green', extra: company.gst }
          ].map((card, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center text-center group transition-all"
            >
              <div className={`w-24 h-24 bg-slate-50 text-slate-900 rounded-[2rem] flex items-center justify-center mb-8 text-4xl group-hover:rotate-12 transition-transform`}>
                <i className={`fas ${card.icon}`}></i>
              </div>
              <h3 className="text-xl font-black mb-4 text-slate-900 uppercase tracking-tight">{card.title}</h3>
              <p className="text-slate-500 leading-relaxed font-bold italic text-sm mb-2">{card.text}</p>
              {card.sub && <p className="text-blue-500 font-black text-xs">{card.sub}</p>}
              {card.extra && <span className="mt-6 font-mono text-blue-600 bg-blue-50 px-5 py-3 rounded-xl font-black border border-blue-100 text-xs tracking-widest">{card.extra}</span>}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
