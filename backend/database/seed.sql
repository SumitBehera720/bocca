-- Seed data for Pharmart Online Pharmacy & Healthcare SQL Database

-- 1. Demo Users (password is 'password123')
INSERT OR REPLACE INTO users (id, username, email, password_hash, role) VALUES 
(1, 'PatientUser', 'patient@pharmart.com', '$2a$10$7qYkXlZc8R9vXmYqVlRz0e8JkY5FhP9XmYqVlRz0e8JkY5FhP9Xm.', 'customer'),
(2, 'HeadPharmacist', 'admin@pharmart.com', '$2a$10$7qYkXlZc8R9vXmYqVlRz0e8JkY5FhP9XmYqVlRz0e8JkY5FhP9Xm.', 'admin');

-- 2. Pharmacy Categories
INSERT OR REPLACE INTO categories (id, name, slug, image, description) VALUES
(1, 'Prescription Medicines', 'prescription-medicines', '/images/homepage-new-cat-6.png', 'Antibiotics, cardiovascular, diabetes, and specialist medications requiring doctor prescription.'),
(2, 'OTC Medicines', 'otc-medicines', '/images/homepage-new-cat-2.png', 'Pain relief, fever reducers, cough syrups, cold medications, and allergy remedies.'),
(3, 'Vitamins & Supplements', 'vitamins-supplements', '/images/homepage-new-cat-3.png', 'Immunity boosters, multivitamins, Vitamin C, minerals, and dietary supplements.'),
(4, 'Medical Devices', 'medical-devices', '/images/homepage-new-cat-1.png', 'Digital thermometers, blood pressure monitors, glucose meters, and oximeters.'),
(5, 'First Aid & Emergency', 'first-aid', '/images/homepage-new-cat-7.png', 'Bandages, antiseptic creams, sterile gauze, wound dressings, and emergency kits.'),
(6, 'Personal & Skin Care', 'personal-care', '/images/homepage-new-cat-8.png', 'Dermatologist-tested face washes, healing moisturizers, sanitizers, and sunscreens.'),
(7, 'Baby & Mother Care', 'baby-care', '/images/homepage-new-cat-4.png', 'Pediatric formulas, baby skincare, feeding bottles, and maternal supplements.'),
(8, 'Health & Wellness', 'health-wellness', '/images/homepage-new-cat-5.png', 'Omega-3 fish oils, joint health, herbal extracts, and sleep wellness aids.'),
(9, 'Ayurvedic & Herbal', 'ayurvedic-herbal', '/images/homepage-new-cat-2.png', 'Traditional herbal teas, immunity tonics, and natural organic remedies.');

-- 3. Certified Pharmaceutical Brands
INSERT OR REPLACE INTO brands (id, brand_name, title, image, link) VALUES
(1, 'Pfizer Healthcare', 'Global Leader in Biopharmaceuticals & Vaccines', '/images/brand-pfizer.svg', '/shop?brand=Pfizer%20Healthcare'),
(2, 'GSK Consumer Health', 'Trusted Pain Relief, Respiratory & Oral Care', '/images/brand-gsk.svg', '/shop?brand=GSK%20Consumer%20Health'),
(3, 'Bayer Pharmaceuticals', 'Science For A Better Life - Cardiology & OTC', '/images/brand-bayer.svg', '/shop?brand=Bayer%20Pharmaceuticals'),
(4, 'Abbott Diagnostics', 'Pioneering Nutrition & Medical Monitoring', '/images/brand-abbott.svg', '/shop?brand=Abbott%20Diagnostics'),
(5, 'Johnson & Johnson', 'Family Healthcare, First Aid & Gentle Skin Care', '/images/brand-jnj.svg', '/shop?brand=Johnson%20%26%20Johnson'),
(6, 'Cipla Therapeutics', 'Affordable Global Healthcare & Respiratory Relief', '/images/brand-cipla.svg', '/shop?brand=Cipla%20Therapeutics'),
(7, 'Dettol Health', 'Antiseptic Disinfection & Hygiene Protection', '/images/brand-dettol.svg', '/shop?brand=Dettol%20Health'),
(8, 'Sun Pharma', 'High Quality Essential Prescription Formulations', '/images/brand-sunpharma.svg', '/shop?brand=Sun%20Pharma');

-- 4. Products (Medicines, Devices & Healthcare Essentials)
INSERT OR REPLACE INTO products (id, product_name, image, pack_size, brand_id, brand_name, manufacturer, description, uses, how_to_use, requires_prescription, price, old_price, stock, sku, expiry_date, is_top_saver, is_best_seller) VALUES
(1, 'Paracetamol Extra 500mg Tablets', '/images/paracetamol.jpg', '20 Tablets (2 Strips)', 2, 'GSK Consumer Health', 'GlaxoSmithKline Pharmaceuticals Ltd', 'Fast-acting analgesic and antipyretic for effective relief of headaches, fever, toothache, and body pain.', 'Relief of mild to moderate pain including headache, migraine, toothache, musculoskeletal ache, and reduction of fever.', 'Adults: Take 1-2 tablets every 4-6 hours with water. Do not exceed 8 tablets in 24 hours.', 0, 4.50, 6.99, 120, 'OTC-001', '2026-10-31', 1, 1),

(2, 'Amoxicillin Trihydrate 500mg Capsules (Rx)', '/images/amoxicillin.jpg', '21 Capsules (Course Pack)', 1, 'Pfizer Healthcare', 'Pfizer Global Supply Co.', 'Broad-spectrum penicillin antibiotic used to treat bacterial infections of the respiratory tract, ear, and urinary system.', 'Treatment of confirmed bacterial infections including bronchitis, pneumonia, otitis media, and sinusitis.', 'Take 1 capsule every 8 hours with or after meals. Complete the entire course as prescribed by your physician.', 1, 14.99, 22.00, 60, 'RX-002', '2026-08-15', 1, 1),

(3, 'Vitamin C 1000mg + Zinc Effervescent', '/images/vitaminc.jpg', '20 Effervescent Tablets', 3, 'Bayer Pharmaceuticals', 'Bayer HealthCare LLC', 'High-potency immune support supplement with antioxidant Vitamin C and essential Zinc for daily defense.', 'Supports healthy immune system function, reduces tiredness and fatigue, and enhances collagen formation.', 'Dissolve 1 effervescent tablet in a glass of cold water (200ml) daily. Drink immediately after preparation.', 0, 8.99, 12.50, 150, 'VIT-003', '2027-02-28', 1, 1),

(4, 'Broncho-Relief Cough & Chest Syrup', '/images/cough_syrup.jpg', '150ml Bottle with Dose Cup', 6, 'Cipla Therapeutics', 'Cipla Respiratory Division', 'Triple-action soothing syrup for productive chesty cough, clearing mucus, and relieving throat irritation.', 'Relief of persistent cough, chest congestion, bronchial catarrh, and sore throat irritation.', 'Adults & Children over 12: 10ml three times daily after food using the provided measuring cup.', 0, 6.75, 9.50, 95, 'OTC-004', '2026-11-30', 1, 1),

(5, 'Digital Infrared Forehead Thermometer', '/images/thermometer.jpg', '1 Unit (Box + Batteries)', 4, 'Abbott Diagnostics', 'Abbott Healthcare Instruments', 'Non-contact high precision infrared medical thermometer with instant 1-second readout and color fever alert.', 'Body temperature screening for infants, children, and adults without physical contact.', 'Point probe 3-5cm from forehead center and press trigger. Result displays in 1 second with color backlight.', 0, 24.99, 39.99, 45, 'DEV-005', '2029-12-31', 1, 1),

(6, 'Comprehensive 120-Piece First Aid Kit', '/images/firstaid.jpg', '1 Waterproof Hard Case', 5, 'Johnson & Johnson', 'Johnson & Johnson Consumer Inc.', 'Complete OSHA-compliant emergency medical kit containing sterile dressings, antiseptic wipes, burn gel, and scissors.', 'Emergency first response for home, office, vehicle, and outdoor minor injuries, cuts, and burns.', 'Follow the enclosed color-coded first aid emergency response manual for wound management.', 0, 19.99, 29.99, 80, 'AID-006', '2028-05-31', 1, 1),

(7, 'Dettol Antiseptic Disinfectant Liquid', '/images/antiseptic.jpg', '500ml Bottle', 7, 'Dettol Health', 'Reckitt Benckiser Healthcare', 'Hospital-grade concentrated antiseptic solution for wound cleansing, personal hygiene, and surface disinfection.', 'Cleansing minor cuts, bites, grazes, insect stings, and general family hygiene.', 'Dilute 1 capful in 250ml of clean warm water before applying with sterile cotton wool.', 0, 5.49, 7.50, 110, 'AID-007', '2027-04-30', 1, 1),

(8, 'Omega-3 Triple Strength 1400mg EPA/DHA', '/images/omega3.jpg', '90 Softgels (3 Month Supply)', 3, 'Bayer Pharmaceuticals', 'Bayer Wellness Science', 'Ultra-purified molecularly distilled fish oil softgels promoting cardiovascular, brain, and joint mobility.', 'Promotes healthy heart function, cognitive clarity, optimal cholesterol levels, and reduces joint stiffness.', 'Take 1 softgel daily with a meal, preferably in the morning with a full glass of water.', 0, 16.99, 24.00, 75, 'VIT-008', '2026-12-31', 1, 1),

(9, 'Atorvastatin Calcium 20mg Tablets (Rx)', '/images/atorvastatin.jpg', '30 Tablets (Monthly Pack)', 8, 'Sun Pharma', 'Sun Pharmaceutical Industries Ltd', 'Prescription statin lipid-lowering medication to control high blood cholesterol and reduce cardiovascular risk.', 'Lowers LDL cholesterol, triglycerides, and reduces the risk of heart attacks and stroke in high-risk patients.', 'Take 1 tablet once daily at bedtime with or without food as prescribed by your cardiologist.', 1, 18.50, 26.00, 50, 'RX-009', '2026-09-30', 1, 1),

(10, 'Gentle Ceramide Hydrating Cleanser', '/images/ceramide_cleanser.jpg', '250ml Pump Bottle', 5, 'Johnson & Johnson', 'Johnson & Johnson Dermatological', 'Dermatologist-formulated non-comedogenic foaming cleanser with 3 essential ceramides and hyaluronic acid.', 'Cleanses sensitive, dry, and eczema-prone skin without disrupting the protective skin moisture barrier.', 'Massage gently onto wet skin in circular motions, then rinse thoroughly with lukewarm water.', 0, 11.25, 15.00, 85, 'SKN-010', '2027-01-31', 1, 1),

(11, 'Blood Glucose Monitoring Kit + 50 Strips', '/images/glucose_meter.jpg', '1 Meter + 50 Strips + Lancets', 4, 'Abbott Diagnostics', 'Abbott Diabetes Care', 'Fast and accurate blood sugar testing system with automatic coding and 5-second test time for diabetes care.', 'Daily self-monitoring of blood glucose levels for individuals with Type 1 and Type 2 diabetes.', 'Insert test strip into meter, apply small blood drop to strip tip, and read digital blood glucose level.', 0, 32.50, 48.00, 40, 'DEV-011', '2028-10-31', 1, 1),

(12, 'Ibuprofen Rapid Action 400mg Capsules', '/images/ibuprofen.jpg', '16 Liquid Gel Capsules', 2, 'GSK Consumer Health', 'GlaxoSmithKline Consumer Healthcare', 'Fast-absorbing non-steroidal anti-inflammatory drug (NSAID) for muscle pain, backache, and inflammation.', 'Relief of inflammation, back pain, dental pain, arthritis discomfort, and menstrual cramps.', 'Take 1 capsule with food or water. Do not exceed 3 capsules in 24 hours without medical advice.', 0, 5.99, 8.50, 90, 'OTC-012', '2026-11-15', 1, 1),

(13, 'Instant Hand Sanitizer Gel 75% Alcohol', '/images/sanitizer.jpg', '500ml Family Pump', 7, 'Dettol Health', 'Reckitt Benckiser Group', 'Hospital-grade antiseptic hand rub killing 99.99% of germs and viruses with Aloe Vera moisturizer.', 'Rapid waterless hand disinfection against bacteria, viruses, and pathogens.', 'Apply coin-sized amount onto palm and rub hands together vigorously until completely dry.', 0, 3.99, 5.50, 200, 'AID-013', '2027-09-30', 1, 1);

-- 5. Product Category Relationships
INSERT OR REPLACE INTO product_categories (product_id, category_id) VALUES
(1, 2), -- Paracetamol -> OTC Medicines
(2, 1), -- Amoxicillin -> Prescription Medicines
(3, 3), -- Vitamin C -> Vitamins & Supplements
(4, 2), -- Cough Syrup -> OTC Medicines
(5, 4), -- Thermometer -> Medical Devices
(6, 5), -- First Aid Kit -> First Aid
(7, 5), -- Dettol -> First Aid
(8, 3), -- Omega 3 -> Vitamins & Supplements
(8, 8), -- Omega 3 -> Health & Wellness
(9, 1), -- Atorvastatin -> Prescription Medicines
(10, 6), -- Cleanser -> Personal Care
(11, 4), -- Glucose Kit -> Medical Devices
(12, 2), -- Ibuprofen -> OTC Medicines
(13, 5), -- Sanitizer -> First Aid
(13, 6); -- Sanitizer -> Personal Care

-- 6. Product Tags
INSERT OR REPLACE INTO product_tags (product_id, tag) VALUES
(1, 'Pain Relief'), (1, 'Fever'), (1, 'OTC'),
(2, 'Antibiotic'), (2, 'Prescription'), (2, 'Rx Required'),
(3, 'Vitamin C'), (3, 'Immunity'), (3, 'Zinc'),
(4, 'Cough'), (4, 'Chest Relief'), (4, 'Syrup'),
(5, 'Thermometer'), (5, 'Infrared'), (5, 'Medical Device'),
(6, 'First Aid'), (6, 'Emergency'), (6, 'Wound Care'),
(7, 'Antiseptic'), (7, 'Disinfectant'), (7, 'Hygiene'),
(8, 'Omega 3'), (8, 'Fish Oil'), (8, 'Heart Health'),
(9, 'Cholesterol'), (9, 'Cardiology'), (9, 'Rx Required'),
(10, 'Skin Care'), (10, 'Dermatologist Tested'), (10, 'Ceramides'),
(11, 'Diabetes'), (11, 'Blood Glucose'), (11, 'Medical Device'),
(12, 'Pain Relief'), (12, 'Anti-Inflammatory'), (12, 'NSAID'),
(13, 'Sanitizer'), (13, 'Alcohol 75%'), (13, 'Disinfection');

-- 7. Verified Reviews
INSERT OR REPLACE INTO reviews (product_id, user_name, rating, comment) VALUES
(1, 'Dr. Sarah Jenkins', 5.0, 'Reliable, rapid pain relief. Authentic pharmacy packaging and long expiry date.'),
(1, 'David Miller', 4.5, 'Works within 20 minutes for tension headaches and mild fever.'),
(2, 'Michael Chang', 5.0, 'Pharmacist verified my prescription promptly and shipped the antibiotic course safely.'),
(3, 'Emily Watson', 5.0, 'Delicious orange effervescent taste, great energy and immunity boost every morning.'),
(4, 'Robert Davis', 4.5, 'Loosened my dry chest cough overnight. High quality pharmacy formulation.'),
(5, 'Jessica Taylor', 5.0, 'Accurate temperature readings, essential for monitoring kids at home.'),
(6, 'Amanda Green', 5.0, 'Very complete medical kit. Sterile gauze, burn gel, and scissors are top medical grade.'),
(7, 'William Harris', 4.5, 'The gold standard for first aid wound cleansing and home hygiene.'),
(8, 'Daniel Clark', 5.0, 'No fishy aftertaste! Excellent EPA/DHA potency verified on the lab label.'),
(9, 'Dr. Arthur Vance', 5.0, 'Standard pharmaceutical-grade Atorvastatin with verified batch numbers.'),
(10, 'Sophia Lee', 4.5, 'Super gentle on sensitive facial skin, leaves no residue or dryness.'),
(11, 'George Evans', 5.0, 'Fast 5-second blood sugar reading and comfortable lancing device.'),
(12, 'Karen Robinson', 4.5, 'Quick relief from lower back ache and joint inflammation.'),
(13, 'Brian Adams', 5.0, 'Leaves hands soft with aloe while giving complete 75% alcohol disinfection.');

-- 8. Sample Prescription Record (Linked to Demo User)
INSERT OR REPLACE INTO prescriptions (id, user_id, order_id, patient_name, doctor_name, prescription_file, status, pharmacist_notes) VALUES
(1, 1, NULL, 'John Patient', 'Dr. Robert Williams (MD License #MED-84920)', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80', 'Approved', 'Verified valid prescription for Amoxicillin 500mg (14-day course).');
