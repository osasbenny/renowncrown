export interface Profile {
  id: string;
  company_name: string;
  contact_person: string;
  phone: string;
  country: string;
  role: 'customer' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  parent_id: string | null;
  sort_order: number;
  created_at: string;
  children?: ProductCategory[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category?: ProductCategory;
  description: string;
  specifications: Record<string, string>;
  packaging_details: string;
  export_info: string;
  quality_standards: string;
  shipping_info: string;
  images: string[];
  min_order_quantity: string;
  price_range: string;
  unit: string;
  origin: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  currency: string;
  shipping_address: Record<string, string>;
  billing_address: Record<string, string>;
  notes: string;
  tracking_number: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  created_at: string;
}

export interface RfqRequest {
  id: string;
  user_id: string | null;
  reference_number: string;
  product_id: string | null;
  product?: Product;
  quantity: string;
  destination_country: string;
  requirements: string;
  status: 'submitted' | 'reviewing' | 'quoted' | 'approved' | 'rejected';
  admin_notes: string;
  quoted_price: number | null;
  created_at: string;
  updated_at: string;
}

export interface Inquiry {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  service_type: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  featured_image: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface FreightRequest {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  phone: string;
  company: string;
  service_type: string;
  origin: string;
  destination: string;
  cargo_type: string;
  weight: string;
  message: string;
  status: 'submitted' | 'reviewing' | 'quoted' | 'confirmed' | 'completed';
  created_at: string;
}

export interface FinancialServiceInquiry {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  service_needed: string;
  commodity_type: string;
  volume: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
}
