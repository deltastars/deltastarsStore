
export type Page = 'home' | 'products' | 'cart' | 'login' | 'dashboard' | 'vipLogin' | 'vipDashboard' | 'wishlist' | 'showroom' | 'productDetail' | 'privacy' | 'terms';

export type User = {
  type: 'admin';
  email: string;
} | {
  type: 'vip';
  phone: string;
  name: string;
};

export type CategoryKey = 'fruits' | 'vegetables' | 'dates' | 'eggs' | 'organic' | 'seasonal' | 'herbs';

export interface Product {
  id: number;
  name_ar: string;
  name_en: string;
  category: CategoryKey;
  price: number;
  original_price?: number;
  image: string;
  unit_ar: string; 
  unit_en: string;
  stock_quantity: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Review {
  id: string;
  productId: number;
  author: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ShowroomItem {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  image: string;
  videoUrl?: string;
  link?: string;
  linkText_ar?: string;
  linkText_en?: string;
  section_ar?: string;
  section_en?: string;
}

export interface VipOrderItem {
  productId: number;
  name_ar: string;
  name_en: string;
  quantity: number;
  price: number;
}

export interface VipOrder {
  id: string;
  clientId: string; // Phone number of the VIP client
  date: string;
  status: 'تم التوصيل' | 'قيد التجهيز' | 'ملغي';
  status_en: 'Delivered' | 'Processing' | 'Cancelled';
  total: number;
  items: VipOrderItem[];
}

export interface Shipment {
  id: string;
  supplier: string;
  eta: string;
  status: 'In Transit' | 'Delayed' | 'Arrived';
  status_ar: 'قيد الشحن' | 'متأخر' | 'وصل';
}

export interface Invoice {
  id: string; // e.g. INV-DS-1024
  orderId: string;
  clientId: string; // Phone number of VIP
  customerName: string; // Company Name
  date: string;
  dueDate: string;
  items: VipOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number; // e.g. 15% VAT
  total: number;
  status: 'Paid' | 'Pending Payment' | 'Pending Confirmation' | 'Overdue';
  status_ar: 'مدفوع' | 'بانتظار الدفع' | 'بانتظار التأكيد' | 'متأخر';
}

export interface Payment {
  id: string;
  invoiceId: string;
  clientId: string;
  date: string;
  amount: number;
  method: 'Bank Transfer' | 'Cash' | 'Card' | 'Unknown';
  method_ar: 'تحويل بنكي' | 'نقداً' | 'بطاقة' | 'غير معروف';
  status: 'Confirmed' | 'Pending';
}

export interface Offer {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  type: 'percentage' | 'fixed';
  value: number;
  status: 'active' | 'inactive';
}

export interface Warehouse {
    id: string;
    name: string;
    location: string;
    capacity: number;
}

export interface Supplier {
    id: string;
    name: string;
    contact: string;
    country: string;
    rating: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  role_ar: string;
  performance: number; // a score out of 100
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action_ar: string;
  action_en: string;
  details?: string;
}

export interface VipClient {
  id: string; // Corresponds to phone number
  phone: string;
  companyName: string;
  contactPerson: string;
  shippingAddress: string;
}

export interface VipTransaction {
    id: string;
    clientId: string; // Phone number of the VIP client
    date: string;
    description_ar: string;
    description_en: string;
    debit: number; // مدين (عليه)
    credit: number; // دائن (له)
    balance: number;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// --- NEW TYPES FOR SETTINGS ---

export interface SocialLinks {
    facebook: string;
    instagram: string;
    telegram: string;
    youtube: string;
    snapchat: string;
    tiktok: string;
    whatsapp: string; // Full URL or number
    linktree: string;
}

export interface CompanySettings {
    name: string;
    slogan_ar: string;
    slogan_en: string;
    phone: string;
    whatsappNumber: string; // Number only
    email: string;
    address_ar: string;
    address_en: string;
    map_url: string;
    logoUrl: string;
    heroImage: string;
    showroomBanner: string;
    primaryColor: string;
    fontFamily: string;
}

export interface AppSettings {
    company: CompanySettings;
    social: SocialLinks;
}

export interface Song {
  title: string;
  artist: string;
  url: string;
  cover: string;
}
