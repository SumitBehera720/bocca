<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin & Customer Users
        DB::table('users')->insert([
            [
                'name' => 'Dr. Pharmacist Admin',
                'email' => 'admin@farmart.com',
                'password' => Hash::make('Admin123@'),
                'role' => 'admin',
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'name' => 'John Customer',
                'email' => 'customer@farmart.com',
                'password' => Hash::make('Customer123@'),
                'role' => 'customer',
                'created_at' => now(), 'updated_at' => now()
            ]
        ]);

        // 2. Categories
        DB::table('categories')->insert([
            ['id' => 1, 'name' => 'Medicine', 'slug' => 'medicine', 'image' => '/images/categories/category-1.png', 'description' => 'Prescription and OTC healthcare medicines', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Personal Care', 'slug' => 'personal-care', 'image' => '/images/categories/category-2.png', 'description' => 'Skin, hair, and hygiene personal care products', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'Baby Care', 'slug' => 'baby-care', 'image' => '/images/categories/category-3.png', 'description' => 'Gentle nutrition and care products for infants', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'name' => 'Health & Nutrition', 'slug' => 'health-nutrition', 'image' => '/images/categories/category-4.png', 'description' => 'Daily dietary supplements and protein care', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'name' => 'Medical Devices', 'slug' => 'medical-devices', 'image' => '/images/categories/category-5.png', 'description' => 'Blood pressure monitors, thermometers & diagnostics', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 6, 'name' => 'Ayurveda', 'slug' => 'ayurveda', 'image' => '/images/categories/category-6.png', 'description' => 'Natural herbal holistic health care products', 'created_at' => now(), 'updated_at' => now()]
        ]);

        // 3. Brands
        DB::table('brands')->insert([
            ['id' => 1, 'brand_name' => 'Pfizer', 'title' => 'Pfizer Global Healthcare', 'image' => '/images/brands/brand-1.png', 'link' => '#', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'brand_name' => 'Cipla', 'title' => 'Caring for Life', 'image' => '/images/brands/brand-2.png', 'link' => '#', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'brand_name' => 'Sun Pharma', 'title' => 'Sun Pharmaceutical Industries', 'image' => '/images/brands/brand-3.png', 'link' => '#', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'brand_name' => 'Abbott', 'title' => 'Abbott Healthcare Solutions', 'image' => '/images/brands/brand-4.png', 'link' => '#', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'brand_name' => 'Dr. Reddys', 'title' => 'Dr. Reddys Laboratories', 'image' => '/images/brands/brand-5.png', 'link' => '#', 'created_at' => now(), 'updated_at' => now()]
        ]);

        // 4. Products
        DB::table('products')->insert([
            [
                'id' => 1,
                'product_name' => 'Paracetamol Extra Strength 650mg',
                'image' => '/images/products/product-1.jpg',
                'pack_size' => '10 Tablets Strip',
                'brand_id' => 2, 'brand_name' => 'Cipla', 'manufacturer' => 'Cipla Healthcare Ltd.',
                'description' => 'Fast acting fever reducer and mild to moderate pain relief tablets.',
                'uses' => 'Fever, headache, muscle ache, toothache, and body pain.',
                'how_to_use' => 'Take 1 tablet every 6 hours after meals as advised by doctor.',
                'requires_prescription' => 0, 'price' => 4.50, 'old_price' => 6.00, 'stock' => 150,
                'sku' => 'MED-PCM-650', 'is_top_saver' => 1, 'is_best_seller' => 1,
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'id' => 2,
                'product_name' => 'Amoxicillin Trihydrate 500mg Capsule',
                'image' => '/images/products/product-2.jpg',
                'pack_size' => '10 Capsules Strip',
                'brand_id' => 1, 'brand_name' => 'Pfizer', 'manufacturer' => 'Pfizer Pharmaceuticals',
                'description' => 'Broad spectrum penicillin antibiotic used for bacterial infection treatment.',
                'uses' => 'Respiratory tract infection, ear infection, dental & skin infection.',
                'how_to_use' => 'Strictly take as prescribed by a licensed doctor. Do not skip doses.',
                'requires_prescription' => 1, 'price' => 12.99, 'old_price' => 18.00, 'stock' => 80,
                'sku' => 'RX-AMX-500', 'is_top_saver' => 0, 'is_best_seller' => 1,
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'id' => 3,
                'product_name' => 'Multivitamin & Mineral Daily Supplement',
                'image' => '/images/products/product-3.jpg',
                'pack_size' => '60 Tablets Bottle',
                'brand_id' => 4, 'brand_name' => 'Abbott', 'manufacturer' => 'Abbott Health Labs',
                'description' => 'Complete daily essential vitamins and zinc mineral dietary supplement.',
                'uses' => 'Boosts immunity, enhances energy levels, improves vitality.',
                'how_to_use' => '1 tablet daily with breakfast or warm water.',
                'requires_prescription' => 0, 'price' => 19.99, 'old_price' => 24.99, 'stock' => 120,
                'sku' => 'NUT-VIT-060', 'is_top_saver' => 1, 'is_best_seller' => 0,
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'id' => 4,
                'product_name' => 'Digital Blood Pressure Monitor Machine',
                'image' => '/images/products/product-4.jpg',
                'pack_size' => '1 Machine Unit',
                'brand_id' => 5, 'brand_name' => 'Dr. Reddys', 'manufacturer' => 'Dr. Reddys Diagnostics',
                'description' => 'Automatic upper arm electronic blood pressure monitor with heart pulse rate sensor.',
                'uses' => 'Accurate home monitoring of blood pressure & pulse rate.',
                'how_to_use' => 'Wrap cuff around arm at heart level and press START button.',
                'requires_prescription' => 0, 'price' => 34.99, 'old_price' => 45.00, 'stock' => 45,
                'sku' => 'DEV-BPM-001', 'is_top_saver' => 0, 'is_best_seller' => 1,
                'created_at' => now(), 'updated_at' => now()
            ],
            [
                'id' => 5,
                'product_name' => 'Organic Neem & Tulsi Herbal Face Wash',
                'image' => '/images/products/product-5.jpg',
                'pack_size' => '150ml Tube',
                'brand_id' => 3, 'brand_name' => 'Sun Pharma', 'manufacturer' => 'Sun Personal Care',
                'description' => 'Ayurvedic anti-acne purifying cleanser infused with natural neem & tulsi.',
                'uses' => 'Prevents pimples, deep cleanses pores, balances oiliness.',
                'how_to_use' => 'Apply small quantity on wet face, gently massage and rinse off.',
                'requires_prescription' => 0, 'price' => 8.50, 'old_price' => 11.00, 'stock' => 200,
                'sku' => 'PC-FW-150', 'is_top_saver' => 1, 'is_best_seller' => 0,
                'created_at' => now(), 'updated_at' => now()
            ]
        ]);

        // 5. Customer Reviews
        DB::table('reviews')->insert([
            ['product_id' => 1, 'user_name' => 'Sarah M.', 'rating' => 5.0, 'comment' => 'Very effective for relieving headaches quickly. Great price!', 'created_at' => now(), 'updated_at' => now()],
            ['product_id' => 1, 'user_name' => 'David K.', 'rating' => 4.5, 'comment' => 'Good value strip packaging and fast delivery from pharmacy.', 'created_at' => now(), 'updated_at' => now()],
            ['product_id' => 2, 'user_name' => 'Robert P.', 'rating' => 5.0, 'comment' => 'Pharmacist verified my doctor prescription within 15 minutes. Very safe.', 'created_at' => now(), 'updated_at' => now()],
            ['product_id' => 4, 'user_name' => 'Anita R.', 'rating' => 5.0, 'comment' => 'Highly accurate digital BP monitor. Easy for senior citizens to operate.', 'created_at' => now(), 'updated_at' => now()]
        ]);
    }
}
