
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { SidebarElements } from './components/SidebarElements';
import { Home } from './pages/Home';
import { ServicesProducts } from './pages/ServicesProducts';
import { AdminPanel } from './pages/AdminPanel';
import { INITIAL_SERVICES, INITIAL_COMPANY_INFO } from './constants';
import { Service, CompanyInfo, Lead } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [company, setCompany] = useState<CompanyInfo>(INITIAL_COMPANY_INFO);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Persistence
  useEffect(() => {
    const savedServices = localStorage.getItem('mahato_services');
    const savedCompany = localStorage.getItem('mahato_company');
    const savedLeads = localStorage.getItem('mahato_leads');
    const savedAuth = sessionStorage.getItem('mahato_is_logged_in');
    
    if (savedServices) setServices(JSON.parse(savedServices));
    if (savedCompany) setCompany(JSON.parse(savedCompany));
    if (savedLeads) setLeads(JSON.parse(savedLeads));
    if (savedAuth === 'true') setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('mahato_services', JSON.stringify(services));
    localStorage.setItem('mahato_company', JSON.stringify(company));
    localStorage.setItem('mahato_leads', JSON.stringify(leads));
    sessionStorage.setItem('mahato_is_logged_in', isLoggedIn.toString());
  }, [services, company, isLoggedIn, leads]);

  const addLead = (leadData: Omit<Lead, 'id' | 'timestamp'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const renderPage = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {(() => {
            switch (currentPage) {
              case 'home':
                return <Home company={company} setCurrentPage={setCurrentPage} addLead={addLead} />;
              case 'services':
                return <ServicesProducts services={services} company={company} addLead={addLead} />;
              case 'admin':
                return (
                  <AdminPanel 
                    services={services} 
                    setServices={setServices} 
                    company={company} 
                    setCompany={setCompany} 
                    leads={leads}
                    deleteLead={deleteLead}
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                  />
                );
              default:
                return <Home company={company} setCurrentPage={setCurrentPage} addLead={addLead} />;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} logoUrl={company.logoUrl} />
      
      <main className="flex-grow">
        {renderPage()}
      </main>

      <SidebarElements company={company} />

      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-white font-bold text-xl mb-2">{company.name}</h4>
            <p className="max-w-xs text-sm">{company.address}</p>
          </div>
          <div className="flex gap-8 font-semibold text-sm">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Career</a>
          </div>
          <p className="text-sm">© 2026 Mahato Enterprises. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
