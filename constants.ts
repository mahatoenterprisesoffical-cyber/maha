
import { Service, CompanyInfo } from './types';

export const INITIAL_COMPANY_INFO: CompanyInfo = {
  name: "MAHATO ENTERPRISES",
  logoUrl: "https://i.ibb.co/L5QGv0P/mahato-logo.png",
  gst: "27CAHPM4416KIZH",
  address: "The Great Indra Nagar, Marol Pipe line, A K Road, Andheri East, Mumbai, Maharashtra 400059",
  phone: "8591379071",
  email: "mahatoenterprises.offical@gmail.com",
  whatsappNumber: "918591379071",
  whatsappQrLink: "https://chat.whatsapp.com/EvcaHluclK1GPY5NVkfW1t",
  ecommerceLink: "https://shop.mahatoenterprises.com"
};

export const INITIAL_SERVICES: Service[] = [
  {
    id: '1',
    name: "Laptop & Desktop Repair",
    description: "Expert chip-level repairing for all brands of laptops and desktops with genuine parts.",
    price: "\u20B9499 (Visiting Fee)",
    category: 'Service',
    imageUrl: "https://images.unsplash.com/photo-1588702547919-26089e690cee?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: '2',
    name: "Printer Servicing",
    description: "Toner refilling and mechanical repair services for Laser and Inkjet printers.",
    price: "\u20B9350 onwards",
    category: 'Service',
    imageUrl: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: '3',
    name: "Business Laptops",
    description: "High-performance enterprise laptops with GST invoices for corporate tax benefits.",
    price: "\u20B935000 onwards",
    category: 'Product',
    imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: '4',
    name: "IT Accessories & Spares",
    description: "Original batteries, adapters, RAM, and SSD upgrades available in stock.",
    price: "\u20B91200 onwards",
    category: 'Product',
    imageUrl: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=800&auto=format&fit=crop"
  }
];
