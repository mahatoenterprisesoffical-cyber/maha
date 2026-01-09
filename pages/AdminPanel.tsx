
import React, { useState } from 'react';
import { Service, CompanyInfo, Lead } from '../types';

interface AdminPanelProps {
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  company: CompanyInfo;
  setCompany: React.Dispatch<React.SetStateAction<CompanyInfo>>;
  leads: Lead[];
  deleteLead: (id: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ services, setServices, company, setCompany, leads, deleteLead, isLoggedIn, setIsLoggedIn }) => {
  const [activeTab, setActiveTab] = useState<'Identity' | 'Inventory' | 'Leads'>('Leads');
  const [isSignup, setIsSignup] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  
  const [newService, setNewService] = useState<Partial<Service>>({
    category: 'Service'
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (isSignup) {
      localStorage.setItem('admin_user', JSON.stringify(authForm));
      setIsLoggedIn(true);
    } else {
      const stored = localStorage.getItem('admin_user');
      if (stored) {
        const user = JSON.parse(stored);
        if (user.email === authForm.email && user.password === authForm.password) {
          setIsLoggedIn(true);
        } else {
          setError('Invalid credentials');
        }
      } else {
        setError('No user found. Please sign up first.');
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setNewService(prev => ({ ...prev, imageUrl: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name || !newService.description || !newService.imageUrl) {
        setError('Please fill all fields and upload an image.');
        return;
    }
    
    let price = newService.price || 'Contact Us';
    if (price !== 'Contact Us' && !price.startsWith('\u20B9')) {
        price = `\u20B9${price}`;
    }

    const item: Service = {
      id: Date.now().toString(),
      name: newService.name,
      description: newService.description,
      price: price,
      category: newService.category as 'Service' | 'Product',
      imageUrl: newService.imageUrl
    };
    
    setServices(prev => [item, ...prev]);
    setNewService({ category: 'Service' });
    setImagePreview(null);
    setError('');
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const handleCompanyUpdate = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompany(prev => ({ ...prev, [name]: value }));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl border border-slate-100 max-w-md w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#001f3f] rounded-2xl flex items-center justify-center text-white text-3xl font-bold italic mx-auto mb-6 shadow-lg">M</div>
            <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">{isSignup ? 'New Admin' : 'Admin Login'}</h2>
            <p className="text-slate-500 font-medium italic">Authorized access only for Mahato Enterprises.</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email</label>
              <input 
                type="email" 
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="admin@mahato.com"
                value={authForm.email}
                onChange={e => setAuthForm({...authForm, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
              <input 
                type="password" 
                required
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
                value={authForm.password}
                onChange={e => setAuthForm({...authForm, password: e.target.value})}
              />
            </div>

            {error && <p className="text-red-500 text-xs font-bold text-center bg-red-50 py-2 rounded-lg">{error}</p>}

            <button type="submit" className="w-full py-5 bg-[#001f3f] hover:bg-slate-800 text-white font-bold rounded-2xl shadow-xl transition-all uppercase tracking-widest">
              {isSignup ? 'Register' : 'Login'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <button 
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-600 font-black text-sm hover:underline uppercase tracking-wide"
            >
              {isSignup ? 'Switch to Login' : "Switch to Sign Up"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Admin Control Panel</h2>
            <p className="text-slate-500 font-medium">Configure company details, manage inventory, and track inquiries.</p>
        </div>
        <button 
          onClick={() => setIsLoggedIn(false)}
          className="px-8 py-3 bg-red-50 text-red-600 font-black rounded-xl hover:bg-red-100 transition-colors uppercase text-sm tracking-widest"
        >
          Sign Out
        </button>
      </div>

      {/* Admin Nav Tabs */}
      <div className="flex gap-4 mb-10 overflow-x-auto pb-2 no-scrollbar">
        {(['Leads', 'Identity', 'Inventory'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-[#001f3f] text-white shadow-xl shadow-blue-900/20' 
                : 'bg-white text-slate-400 hover:text-slate-800 border border-slate-100'
            }`}
          >
            {tab} {tab === 'Leads' && leads.length > 0 && <span className="ml-2 bg-blue-500 px-2 py-0.5 rounded-full text-[9px]">{leads.length}</span>}
          </button>
        ))}
      </div>

      {activeTab === 'Leads' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
             <div className="p-10 border-b border-slate-50 flex justify-between items-center">
               <h3 className="text-xl font-black uppercase tracking-widest text-slate-900">Customer Inquiries</h3>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Total Leads: {leads.length}</span>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                   <tr>
                     <th className="px-10 py-6">Timestamp</th>
                     <th className="px-10 py-6">Customer</th>
                     <th className="px-10 py-6">Location</th>
                     <th className="px-10 py-6">Requirement For</th>
                     <th className="px-10 py-6">Details</th>
                     <th className="px-10 py-6 text-center">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {leads.map(lead => (
                     <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-10 py-8 whitespace-nowrap">
                         <span className="text-xs font-bold text-slate-400">{new Date(lead.timestamp).toLocaleString()}</span>
                       </td>
                       <td className="px-10 py-8">
                         <div className="flex flex-col">
                           <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{lead.userName}</span>
                           <span className="text-xs font-bold text-blue-600">{lead.contactNumber}</span>
                         </div>
                       </td>
                       <td className="px-10 py-8">
                         <span className="text-sm font-black text-slate-600">{lead.pincode}</span>
                       </td>
                       <td className="px-10 py-8">
                         <span className="px-4 py-2 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-700">
                           {lead.itemName}
                         </span>
                       </td>
                       <td className="px-10 py-8">
                         <p className="text-sm font-medium text-slate-500 italic max-w-xs truncate" title={lead.requirement}>
                           "{lead.requirement || 'No additional details provided'}"
                         </p>
                       </td>
                       <td className="px-10 py-8 text-center">
                         <button 
                          onClick={() => deleteLead(lead.id)}
                          className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                         >
                           <i className="fas fa-trash-alt text-xs"></i>
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
               {leads.length === 0 && (
                 <div className="py-20 text-center">
                   <i className="fas fa-inbox text-5xl text-slate-100 mb-6"></i>
                   <p className="text-slate-400 font-black uppercase tracking-widest">No leads captured yet.</p>
                 </div>
               )}
             </div>
          </div>
        </div>
      )}

      {activeTab === 'Identity' && (
        <div className="grid lg:grid-cols-1 gap-12 animate-fadeIn">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
            <h3 className="text-xl font-black mb-8 text-slate-900 flex items-center gap-3 uppercase tracking-wider">
              <i className="fas fa-building text-blue-500"></i> Identity
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Business Name</label>
                <input
                  type="text"
                  name="name"
                  value={company.name}
                  onChange={handleCompanyUpdate}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Logo URL</label>
                <input
                  type="text"
                  name="logoUrl"
                  value={company.logoUrl}
                  onChange={handleCompanyUpdate}
                  placeholder="https://link-to-your-logo.png"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">GST (Verified)</label>
                <input
                  type="text"
                  name="gst"
                  value={company.gst}
                  onChange={handleCompanyUpdate}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">WhatsApp Number</label>
                <input
                  type="text"
                  name="whatsappNumber"
                  value={company.whatsappNumber}
                  onChange={handleCompanyUpdate}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Location</label>
                <textarea
                  name="address"
                  value={company.address}
                  onChange={handleCompanyUpdate}
                  rows={3}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm leading-relaxed font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Inventory' && (
        <div className="grid lg:grid-cols-2 gap-12 animate-fadeIn">
          {/* Add New */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h3 className="text-xl font-black mb-8 text-slate-900 flex items-center gap-3 uppercase tracking-wider">
              <i className="fas fa-plus-circle text-green-500"></i> New Offering
            </h3>
            <form onSubmit={handleAddService} className="grid md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Service/Product Name</label>
                <input
                  type="text"
                  value={newService.name || ''}
                  onChange={e => setNewService({...newService, name: e.target.value})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Type</label>
                <select
                  value={newService.category}
                  onChange={e => setNewService({...newService, category: e.target.value as any})}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold"
                >
                  <option value="Service">Service</option>
                  <option value="Product">Product</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Price (\u20B9)</label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-900">\u20B9</span>
                  <input
                    type="text"
                    value={newService.price || ''}
                    onChange={e => setNewService({...newService, price: e.target.value})}
                    placeholder="500"
                    className="w-full pl-10 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Summary</label>
                <textarea
                  value={newService.description || ''}
                  onChange={e => setNewService({...newService, description: e.target.value})}
                  rows={2}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">Image Upload (Required)</label>
                <div className="flex flex-wrap items-center gap-6 mt-3">
                   {imagePreview ? (
                      <div className="relative w-32 h-32 rounded-3xl overflow-hidden border-4 border-blue-500 shadow-lg">
                        <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                        <button 
                          onClick={() => { setImagePreview(null); setNewService(prev => ({...prev, imageUrl: ''})) }}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                   ) : (
                      <div className="w-32 h-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-2">
                        <i className="fas fa-cloud-upload-alt text-2xl"></i>
                        <span className="text-[10px] font-bold">UPLOADER</span>
                      </div>
                   )}
                   <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="text-xs text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-[#001f3f] file:text-white hover:file:bg-slate-800 cursor-pointer"
                        required
                      />
                   </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full py-5 bg-green-600 hover:bg-green-700 text-white font-black rounded-2xl shadow-xl transition-all uppercase tracking-widest text-sm">
                  Add to Catalog
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4 pb-20">
            <h3 className="text-sm font-black text-slate-400 px-2 uppercase tracking-[0.2em]">Active Inventory ({services.length})</h3>
            <div className="grid gap-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {services.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
                  <div className="flex items-center gap-6">
                    <img src={item.imageUrl} className="w-20 h-20 rounded-2xl object-cover shadow-inner" alt="" />
                    <div>
                      <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">{item.name}</h4>
                      <div className="flex items-center gap-4 mt-1">
                         <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                           item.category === 'Service' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-green-50 text-green-600 border border-green-100'
                         }`}>
                           {item.category}
                         </span>
                         <span className="text-sm font-black text-slate-900">{item.price}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteService(item.id)}
                    className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
