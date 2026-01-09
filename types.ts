
export interface Service {
  id: string;
  name: string;
  description: string;
  price?: string;
  category: 'Service' | 'Product';
  imageUrl: string;
}

export interface Lead {
  id: string;
  userName: string;
  contactNumber: string;
  pincode: string;
  requirement: string;
  itemName: string;
  timestamp: number;
}

export interface CompanyInfo {
  name: string;
  logoUrl: string;
  gst: string;
  address: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  whatsappQrLink: string;
  ecommerceLink: string;
}

export interface AuthUser {
  email: string;
  password?: string;
}
