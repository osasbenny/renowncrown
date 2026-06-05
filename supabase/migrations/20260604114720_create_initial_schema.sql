/*
  # RenownCrown Investment - Initial Database Schema

  Creates the complete database schema for the B2B Agricultural Commodity Trading Platform.

  ## New Tables

  1. **profiles** - Extended user profiles linked to auth.users
     - id (uuid, PK, FK to auth.users)
     - company_name (text)
     - contact_person (text)
     - phone (text)
     - country (text)
     - role (text, default 'customer')
     - created_at, updated_at (timestamps)

  2. **product_categories** - Product category hierarchy
     - id (uuid, PK)
     - name (text, unique)
     - slug (text, unique)
     - description (text)
     - icon (text)
     - parent_id (uuid, FK self-referential)
     - sort_order (int)
     - created_at (timestamp)

  3. **products** - Agricultural commodity products
     - id (uuid, PK)
     - name (text)
     - slug (text, unique)
     - category_id (uuid, FK to product_categories)
     - description (text)
     - specifications (jsonb)
     - packaging_details (text)
     - export_info (text)
     - quality_standards (text)
     - shipping_info (text)
     - images (text[])
     - min_order_quantity (text)
     - price_range (text)
     - unit (text)
     - origin (text)
     - is_featured (boolean)
     - is_active (boolean)
     - created_at, updated_at (timestamps)

  4. **orders** - Customer orders
     - id (uuid, PK)
     - user_id (uuid, FK to auth.users)
     - order_number (text, unique)
     - status (text, default 'pending')
     - total_amount (numeric)
     - currency (text, default 'USD')
     - shipping_address (jsonb)
     - billing_address (jsonb)
     - notes (text)
     - tracking_number (text)
     - created_at, updated_at (timestamps)

  5. **order_items** - Items within orders
     - id (uuid, PK)
     - order_id (uuid, FK to orders)
     - product_id (uuid, FK to products)
     - quantity (numeric)
     - unit_price (numeric)
     - total_price (numeric)
     - created_at (timestamp)

  6. **rfq_requests** - Request for Quote submissions
     - id (uuid, PK)
     - user_id (uuid, FK to auth.users)
     - reference_number (text, unique)
     - product_id (uuid, FK to products)
     - quantity (text)
     - destination_country (text)
     - requirements (text)
     - status (text, default 'submitted')
     - admin_notes (text)
     - quoted_price (numeric)
     - created_at, updated_at (timestamps)

  7. **cart_items** - Shopping cart items
     - id (uuid, PK)
     - user_id (uuid, FK to auth.users)
     - product_id (uuid, FK to products)
     - quantity (numeric)
     - created_at (timestamp)

  8. **inquiries** - General inquiries and contact form submissions
     - id (uuid, PK)
     - name (text)
     - company (text)
     - email (text)
     - phone (text)
     - service_type (text)
     - message (text)
     - status (text, default 'new')
     - created_at (timestamp)

  9. **blog_posts** - News and insights articles
     - id (uuid, PK)
     - title (text)
     - slug (text, unique)
     - excerpt (text)
     - content (text)
     - category (text)
     - tags (text[])
     - author (text)
     - featured_image (text)
     - is_published (boolean)
     - published_at (timestamp)
     - created_at, updated_at (timestamps)

  10. **freight_requests** - Freight/logistics service requests
     - id (uuid, PK)
     - user_id (uuid, FK to auth.users, nullable)
     - name (text)
     - email (text)
     - phone (text)
     - company (text)
     - service_type (text)
     - origin (text)
     - destination (text)
     - cargo_type (text)
     - weight (text)
     - message (text)
     - status (text, default 'submitted')
     - created_at (timestamp)

  11. **financial_service_inquiries** - Commodity financial services inquiries
     - id (uuid, PK)
     - name (text)
     - company (text)
     - email (text)
     - phone (text)
     - service_needed (text)
     - commodity_type (text)
     - volume (text)
     - message (text)
     - status (text, default 'new')
     - created_at (timestamp)

  ## Security
  - RLS enabled on ALL tables
  - Policies for authenticated users to manage their own data
  - Admin role can access all data
  - Public read access for products, categories, and published blog posts
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text DEFAULT '',
  contact_person text DEFAULT '',
  phone text DEFAULT '',
  country text DEFAULT '',
  role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Product categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT '',
  parent_id uuid REFERENCES product_categories(id) ON DELETE SET NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product categories"
  ON product_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage product categories"
  ON product_categories FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update product categories"
  ON product_categories FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete product categories"
  ON product_categories FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES product_categories(id) ON DELETE SET NULL,
  description text DEFAULT '',
  specifications jsonb DEFAULT '{}',
  packaging_details text DEFAULT '',
  export_info text DEFAULT '',
  quality_standards text DEFAULT '',
  shipping_info text DEFAULT '',
  images text[] DEFAULT '{}',
  min_order_quantity text DEFAULT '',
  price_range text DEFAULT '',
  unit text DEFAULT 'MT',
  origin text DEFAULT '',
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  order_number text UNIQUE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount numeric DEFAULT 0,
  currency text DEFAULT 'USD',
  shipping_address jsonb DEFAULT '{}',
  billing_address jsonb DEFAULT '{}',
  notes text DEFAULT '',
  tracking_number text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity numeric NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  total_price numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Users can create own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- RFQ requests table
CREATE TABLE IF NOT EXISTS rfq_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reference_number text UNIQUE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity text DEFAULT '',
  destination_country text DEFAULT '',
  requirements text DEFAULT '',
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'quoted', 'approved', 'rejected')),
  admin_notes text DEFAULT '',
  quoted_price numeric DEFAULT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE rfq_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own RFQ requests"
  ON rfq_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can create RFQ requests"
  ON rfq_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update RFQ requests"
  ON rfq_requests FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity numeric NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text DEFAULT '',
  email text NOT NULL,
  phone text DEFAULT '',
  service_type text DEFAULT '',
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view inquiries"
  ON inquiries FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Anyone can submit inquiries"
  ON inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update inquiries"
  ON inquiries FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text DEFAULT '',
  content text DEFAULT '',
  category text DEFAULT '',
  tags text[] DEFAULT '{}',
  author text DEFAULT '',
  featured_image text DEFAULT '',
  is_published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Freight requests table
CREATE TABLE IF NOT EXISTS freight_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  company text DEFAULT '',
  service_type text DEFAULT '',
  origin text DEFAULT '',
  destination text DEFAULT '',
  cargo_type text DEFAULT '',
  weight text DEFAULT '',
  message text DEFAULT '',
  status text DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'quoted', 'confirmed', 'completed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE freight_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view freight requests"
  ON freight_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Anyone can submit freight requests"
  ON freight_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update freight requests"
  ON freight_requests FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Financial service inquiries table
CREATE TABLE IF NOT EXISTS financial_service_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text DEFAULT '',
  email text NOT NULL,
  phone text DEFAULT '',
  service_needed text DEFAULT '',
  commodity_type text DEFAULT '',
  volume text DEFAULT '',
  message text DEFAULT '',
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE financial_service_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view financial inquiries"
  ON financial_service_inquiries FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Anyone can submit financial inquiries"
  ON financial_service_inquiries FOR INSERT
  TO anon,authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update financial inquiries"
  ON financial_service_inquiries FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
