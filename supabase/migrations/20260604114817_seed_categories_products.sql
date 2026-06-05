/*
  # Seed Data - Product Categories and Sample Products

  ## Product Categories Added
  1. Agricultural Commodities (parent)
     - Grains & Oilseeds
     - Rice
     - Specialty Grains & Seeds
  2. Export Crops (parent)
     - Cocoa Beans
     - Coffee Beans
     - Sesame Seeds
     - Groundnuts & Nuts
  3. Spices (parent)
     - Ginger
     - Turmeric
     - Chili Pepper
     - Garlic
  4. Industrial Commodities (parent)
     - Cotton
     - Rubber
     - Wood Products
     - Edible Oils
  5. Integrated Feed & Protein

  ## Sample Products Added
  - Premium Raw Cocoa Beans
  - Arabica Coffee Beans
  - Sesame Seeds (Hulled)
  - Premium Basmati Rice
  - Raw Cashew Nuts
  - Yellow Maize (Corn)
  - Dried Ginger Root
  - Premium Turmeric
  - Crude Palm Oil
  - Raw Cotton Lint
  - Natural Rubber (TSR)
  - Soybean Meal
*/

-- Insert product categories
INSERT INTO product_categories (name, slug, description, icon, sort_order) VALUES
  ('Agricultural Commodities', 'agricultural-commodities', 'Core agricultural raw materials and staple crops traded globally', 'Wheat', 1),
  ('Grains & Oilseeds', 'grains-oilseeds', 'Global trade in cereal grains and oilseed products', 'Barrel', 2),
  ('Rice', 'rice', 'Premium rice varieties from top-producing regions', 'Grain', 3),
  ('Specialty Grains & Seeds', 'specialty-grains-seeds', 'Niche grain and seed varieties for specialized markets', 'Sprout', 4),
  ('Export Crops', 'export-crops', 'High-value export crops from tropical and subtropical regions', 'Globe', 5),
  ('Cocoa Beans', 'cocoa-beans', 'Premium cocoa beans for chocolate and confectionery industries', 'Leaf', 6),
  ('Coffee Beans', 'coffee-beans', 'Specialty and commercial grade coffee beans', 'Coffee', 7),
  ('Sesame Seeds', 'sesame-seeds', 'High-quality sesame seeds for food and oil production', 'CircleDot', 8),
  ('Groundnuts & Nuts', 'groundnuts-nuts', 'Premium groundnuts and tree nuts for global markets', 'Nut', 9),
  ('Spices', 'spices', 'Authentic spices from renowned growing regions', 'Flame', 10),
  ('Ginger', 'ginger', 'Fresh and dried ginger root products', 'Flower', 11),
  ('Turmeric', 'turmeric', 'Premium turmeric for culinary and industrial use', 'Sun', 12),
  ('Chili Pepper', 'chili-pepper', 'Dried and fresh chili pepper varieties', 'Zap', 13),
  ('Garlic', 'garlic', 'Premium garlic for export markets', 'Shield', 14),
  ('Industrial Commodities', 'industrial-commodities', 'Raw materials for industrial manufacturing processes', 'Factory', 15),
  ('Cotton', 'cotton', 'Raw cotton lint and cotton products', 'Cloud', 16),
  ('Rubber', 'rubber', 'Natural rubber for industrial applications', 'Circle', 17),
  ('Wood Products', 'wood-products', 'Timber and processed wood products', 'TreePine', 18),
  ('Edible Oils', 'edible-oils', 'Refined and crude edible oil products', 'Droplet', 19),
  ('Integrated Feed & Protein', 'feed-protein', 'Animal feed and protein meal products', 'Beef', 20)
  ON CONFLICT (slug) DO NOTHING;

-- Set parent relationships
UPDATE product_categories SET parent_id = (SELECT id FROM product_categories WHERE slug = 'agricultural-commodities' LIMIT 1) WHERE slug IN ('grains-oilseeds', 'rice', 'specialty-grains-seeds');
UPDATE product_categories SET parent_id = (SELECT id FROM product_categories WHERE slug = 'export-crops' LIMIT 1) WHERE slug IN ('cocoa-beans', 'coffee-beans', 'sesame-seeds', 'groundnuts-nuts');
UPDATE product_categories SET parent_id = (SELECT id FROM product_categories WHERE slug = 'spices' LIMIT 1) WHERE slug IN ('ginger', 'turmeric', 'chili-pepper', 'garlic');
UPDATE product_categories SET parent_id = (SELECT id FROM product_categories WHERE slug = 'industrial-commodities' LIMIT 1) WHERE slug IN ('cotton', 'rubber', 'wood-products', 'edible-oils');

-- Insert sample products
INSERT INTO products (name, slug, category_id, description, specifications, packaging_details, export_info, quality_standards, shipping_info, images, min_order_quantity, price_range, unit, origin, is_featured) VALUES
  (
    'Premium Raw Cocoa Beans',
    'premium-raw-cocoa-beans',
    (SELECT id FROM product_categories WHERE slug = 'cocoa-beans' LIMIT 1),
    'Sourced from the finest cocoa-growing regions of West Africa, our premium raw cocoa beans offer exceptional flavor profiles suitable for high-end chocolate manufacturing. Fermented and sun-dried to perfection, these beans deliver the rich, complex flavors that artisan chocolatiers demand.',
    '{"Moisture Content": "<8%", "Bean Count": "55-65 beans/100g", "Fermentation": "Properly fermented", "Broken Beans": "<5%", "Slug Damage": "<3%", "Mold": "<3%"}',
    '60kg jute bags, palletized for container shipping. Custom packaging available upon request.',
    'Compliant with EU and FDA import regulations. Phytosanitary certificate included.',
    'ISO 22000, HACCP, Rainforest Alliance certified options available.',
    'FOB Lagos/Nigeria or Abidjan/Ivory Coast. 20ft container holds approximately 18-20 MT.',
    '{"https://images.pexels.com/photos/4110311/pexels-photo-4110311.jpeg", "https://images.pexels.com/photos/65882/pexels-photo-65882.jpeg"}',
    '18 MT',
    '$3,200 - $4,500',
    'MT',
    'Nigeria, Ivory Coast, Ghana',
    true
  ),
  (
    'Arabica Coffee Beans',
    'arabica-coffee-beans',
    (SELECT id FROM product_categories WHERE slug = 'coffee-beans' LIMIT 1),
    'Premium Arabica coffee beans sourced from the highlands of East Africa and South America. Our carefully selected beans are processed using washed and natural methods to bring out the complex flavor notes that specialty roasters seek.',
    '{"Moisture Content": "10-12%", "Screen Size": "15+", "Defect Rate": "<5%", "Density": ">700kg/m³", "Cup Score": "80+ SCA"}',
    '60kg jute bags with grain pro liner. Vacuum-packed options available.',
    'Full export documentation. Compliant with ICO standards.',
    'SCA Cupping Standard, UTZ/Rainforest Alliance certified options.',
    'FOB Mombasa/Dar es Salaam. Full container loads or LCL available.',
    '{"https://images.pexels.com/photos/2229358/pexels-photo-2229358.jpeg", "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg"}',
    '18 MT',
    '$4,000 - $6,500',
    'MT',
    'Ethiopia, Kenya, Colombia',
    true
  ),
  (
    'Sesame Seeds (Hulled)',
    'sesame-seeds-hulled',
    (SELECT id FROM product_categories WHERE slug = 'sesame-seeds' LIMIT 1),
    'Premium hulled sesame seeds with uniform color and size. Ideal for tahini production, bakery applications, and direct consumption. Our seeds are carefully processed to remove hulls while maintaining nutritional integrity.',
    '{"Purity": ">99.5%", "Moisture": "<6%", "Oil Content": ">48%", "Free Fatty Acid": "<2%", "Color": "White/Light Golden"}',
    '25kg multi-wall paper bags or 50kg PP bags. Palletized upon request.',
    'Phytosanitary certificate, certificate of origin. Aflatoxin testing available.',
    'ISO 22000, HACCP certified. Non-GMO verified.',
    'FOB Lagos. 20ft container holds approximately 22-24 MT.',
    '{"https://images.pexels.com/photo-615704/pexels-photo-615704.jpeg"}',
    '22 MT',
    '$1,800 - $2,800',
    'MT',
    'Nigeria, India, Tanzania',
    true
  ),
  (
    'Premium Basmati Rice',
    'premium-basmati-rice',
    (SELECT id FROM product_categories WHERE slug = 'rice' LIMIT 1),
    'Extra-long grain Basmati rice known for its aromatic fragrance and elongation upon cooking. Sourced from premium rice-growing regions, our Basmati rice meets the highest international quality standards for export markets.',
    '{"Grain Length": ">7.1mm", "Elongation Ratio": ">2.0", "Aroma": "Strong", "Broken Grains": "<5%", "Moisture": "<14%"}',
    '25kg or 50kg PP bags. Custom private labeling available.',
    'Full export documentation. SGS inspection available.',
    'ISO 22000, BRC certified. Non-GMO.',
    'FOB origin port. 20ft container holds approximately 24-26 MT.',
    '{"https://images.pexels.com/photos/615704/pexels-photo-615704.jpeg"}',
    '24 MT',
    '$700 - $1,200',
    'MT',
    'India, Pakistan',
    true
  ),
  (
    'Raw Cashew Nuts',
    'raw-cashew-nuts',
    (SELECT id FROM product_categories WHERE slug = 'groundnuts-nuts' LIMIT 1),
    'Premium quality raw cashew nuts from West Africa. Carefully harvested and processed to preserve kernel quality. Our cashew nuts are graded to international standards and ideal for processing facilities worldwide.',
    '{"Out-turn Rate": ">48 lbs", "Moisture": "<10%", "Defective Kernels": "<5%", "Kernel Size": "W240-W320"}',
    '80kg jute bags. Palletized for container loading.',
    'Phytosanitary certificate, certificate of origin.',
    'ISO 22000, HACCP certified.',
    'FOB Lagos/Cotonou. 20ft container holds approximately 14-16 MT.',
    '{"https://images.pexels.com/photos/12955602/pexels-photo-12955602.jpeg"}',
    '14 MT',
    '$1,200 - $2,000',
    'MT',
    'Nigeria, Ivory Coast, Vietnam',
    true
  ),
  (
    'Yellow Maize (Corn)',
    'yellow-maize-corn',
    (SELECT id FROM product_categories WHERE slug = 'grains-oilseeds' LIMIT 1),
    'High-quality yellow maize for animal feed and food processing applications. Sourced from top-producing regions with consistent quality and competitive pricing for bulk commodity buyers.',
    '{"Moisture": "<14%", "Protein": ">9%", "Test Weight": ">72 kg/hl", "Foreign Material": "<2%", "Damaged Kernels": "<5%"}',
    '50kg PP bags or bulk container loading.',
    'Phytosanitary certificate, certificate of origin, GMO declaration.',
    'ISO 22000, GMP+ certified.',
    'FOB origin port. Bulk vessel or container shipping.',
    '{"https://images.pexels.com/photos/5415116/pexels-photo-5415116.jpeg"}',
    '500 MT',
    '$250 - $350',
    'MT',
    'Brazil, USA, Ukraine',
    false
  ),
  (
    'Dried Ginger Root',
    'dried-ginger-root',
    (SELECT id FROM product_categories WHERE slug = 'ginger' LIMIT 1),
    'Premium dried ginger root from Nigeria and India. Known for its high oleoresin content and pungent flavor, our dried ginger is ideal for spice blending, herbal teas, and food manufacturing.',
    '{"Moisture": "<12%", "Oleoresin": ">4%", "Fiber": "<6%", "Ash Content": "<8%", "Color": "Light Brown"}',
    '25kg jute bags or corrugated boxes. Custom packaging available.',
    'Phytosanitary certificate. Aflatoxin and pesticide residue testing.',
    'ISO 22000, HACCP, Organic certified options.',
    'FOB Lagos. Air and sea freight available.',
    '{"https://images.pexels.com/photos/4198555/pexels-photo-4198555.jpeg"}',
    '10 MT',
    '$2,500 - $4,500',
    'MT',
    'Nigeria, India',
    false
  ),
  (
    'Premium Turmeric',
    'premium-turmeric',
    (SELECT id FROM product_categories WHERE slug = 'turmeric' LIMIT 1),
    'High-curcumin turmeric fingers and powder from premium growing regions. Our turmeric is valued for its vibrant color and high curcumin content, making it ideal for food, cosmetic, and supplement applications.',
    '{"Curcumin Content": ">3%", "Moisture": "<12%", "Ash Content": "<7%", "Color Value": "EBC 150+", "Mesh Size": "80-200 mesh (powder)"}',
    '25kg double-layer PP bags with inner PE liner.',
    'Phytosanitary certificate, certificate of analysis.',
    'ISO 22000, HACCP, Organic certified options.',
    'FOB origin port. Sea and air freight available.',
    '{"https://images.pexels.com/photos/615704/pexels-photo-615704.jpeg"}',
    '12 MT',
    '$1,800 - $3,500',
    'MT',
    'India, Nigeria',
    false
  ),
  (
    'Crude Palm Oil',
    'crude-palm-oil',
    (SELECT id FROM product_categories WHERE slug = 'edible-oils' LIMIT 1),
    'Premium crude palm oil from sustainable plantations. Suitable for further refining or direct industrial applications. Our palm oil is RSPO-certified and meets international quality standards for food-grade export.',
    '{"Free Fatty Acid": "<5%", "Moisture": "<0.5%", "Impurities": "<0.1%", "Iodine Value": "50-55", "Color": "Orange-Red"}',
    'Flexi-bags in 20ft containers (approx 22 MT) or IBC totes.',
    'RSPO certification, certificate of analysis, HALAL certification.',
    'ISO 22000, RSPO, HALAL certified.',
    'FOB origin port. Flexi-bag or bulk tanker shipping.',
    '{"https://images.pexels.com/photos/7750302/pexels-photo-7750302.jpeg"}',
    '22 MT',
    '$800 - $1,100',
    'MT',
    'Malaysia, Indonesia',
    false
  ),
  (
    'Raw Cotton Lint',
    'raw-cotton-lint',
    (SELECT id FROM product_categories WHERE slug = 'cotton' LIMIT 1),
    'Premium raw cotton lint for textile manufacturing. Our cotton is hand-picked to ensure minimal contamination and maximum fiber quality. Available in various staple lengths to suit different spinning requirements.',
    '{"Staple Length": "28-32mm", "Micronaire": "3.5-4.9", "Strength": ">28 gpt", "Uniformity": ">82%", "Trash Content": "<3%"}',
    '180-200 kg bales, wrapped in cotton cloth. Standard shipping marks.',
    'HVI test data available. Certificate of origin.',
    'BCI, Organic certified options.',
    'FOB origin port. 40ft HC container holds approximately 130-150 bales.',
    '{"https://images.pexels.com/photo-615704/pexels-photo-615704.jpeg"}',
    '100 bales',
    '$1,500 - $2,200',
    'bale',
    'Mali, Burkina Faso, India',
    false
  ),
  (
    'Natural Rubber (TSR)',
    'natural-rubber-tsr',
    (SELECT id FROM product_categories WHERE slug = 'rubber' LIMIT 1),
    'Technically Specified Rubber (TSR) grades for industrial tire and rubber product manufacturing. Our natural rubber is sourced from sustainable plantations and processed to strict technical specifications.',
    '{"Moisture": "<0.8%", "Ash Content": "<0.6%", "Volatile Matter": "<1%", "Nitrogen": "<0.6%", "Plasticity": "30-40"}',
    '33.3 kg bales, palletized. 20ft container holds approximately 20 MT.',
    'Certificate of analysis, certificate of origin.',
    'ISO 9001, ISO 14001 certified.',
    'FOB origin port. Container shipping.',
    '{"https://images.pexels.com/photo-615704/pexels-photo-615704.jpeg"}',
    '20 MT',
    '$1,400 - $2,000',
    'MT',
    'Thailand, Ivory Coast, Malaysia',
    false
  ),
  (
    'Soybean Meal',
    'soybean-meal',
    (SELECT id FROM product_categories WHERE slug = 'feed-protein' LIMIT 1),
    'High-protein soybean meal for animal feed manufacturing. Our soybean meal is produced from premium soybeans through expeller or solvent extraction, delivering consistent protein content for livestock nutrition.',
    '{"Protein": ">46%", "Moisture": "<12%", "Fiber": "<7%", "Ash": "<7%", "Urease Activity": "0.05-0.3 pH"}',
    '50kg PP bags or bulk container loading.',
    'Certificate of analysis, non-GMO declaration available.',
    'ISO 22000, GMP+, FAMI-QS certified.',
    'FOB origin port. Bulk vessel or container.',
    '{"https://images.pexels.com/photo-615704/pexels-photo-615704.jpeg"}',
    '500 MT',
    '$350 - $500',
    'MT',
    'Brazil, Argentina, USA',
    false
  )
  ON CONFLICT (slug) DO NOTHING;
