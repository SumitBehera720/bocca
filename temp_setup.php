<?php
$base = '/home/u892283443/farmart-laravel';

// Update users migration to add role
$userMigration = '<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create("users", function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("email")->unique();
            $table->string("password");
            $table->string("role")->default("customer");
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists("users"); }
};';
file_put_contents("$base/database/migrations/0001_01_01_000000_create_users_table.php", $userMigration);

// Additional Migrations
$migrations = [
  '2026_01_01_000001_create_categories_table.php' => '<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create("categories", function (Blueprint $table) {
            $table->id();
            $table->string("name");
            $table->string("slug")->unique();
            $table->string("image")->nullable();
            $table->text("description")->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists("categories"); }
};',

  '2026_01_01_000002_create_brands_table.php' => '<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create("brands", function (Blueprint $table) {
            $table->id();
            $table->string("brand_name");
            $table->string("title");
            $table->string("image")->nullable();
            $table->string("link")->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists("brands"); }
};',

  '2026_01_01_000003_create_products_table.php' => '<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create("products", function (Blueprint $table) {
            $table->id();
            $table->string("product_name");
            $table->string("image");
            $table->string("pack_size")->default("1 Pack");
            $table->foreignId("brand_id")->nullable()->constrained("brands")->nullOnDelete();
            $table->string("brand_name")->nullable();
            $table->string("manufacturer")->nullable();
            $table->text("description")->nullable();
            $table->text("uses")->nullable();
            $table->text("how_to_use")->nullable();
            $table->boolean("requires_prescription")->default(false);
            $table->decimal("price", 10, 2);
            $table->decimal("old_price", 10, 2)->default(0.00);
            $table->integer("stock")->default(100);
            $table->string("sku")->nullable();
            $table->boolean("is_top_saver")->default(false);
            $table->boolean("is_best_seller")->default(false);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists("products"); }
};',

  '2026_01_01_000004_create_reviews_table.php' => '<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create("reviews", function (Blueprint $table) {
            $table->id();
            $table->foreignId("product_id")->constrained("products")->cascadeOnDelete();
            $table->string("user_name");
            $table->decimal("rating", 2, 1);
            $table->text("comment")->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists("reviews"); }
};',

  '2026_01_01_000005_create_prescriptions_table.php' => '<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create("prescriptions", function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->nullable()->constrained("users")->nullOnDelete();
            $table->unsignedBigInteger("order_id")->nullable();
            $table->string("patient_name");
            $table->string("doctor_name")->nullable();
            $table->text("prescription_file");
            $table->string("status")->default("pending");
            $table->text("notes")->nullable();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists("prescriptions"); }
};',

  '2026_01_01_000006_create_cart_items_table.php' => '<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create("cart_items", function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->nullable()->constrained("users")->cascadeOnDelete();
            $table->string("session_id")->nullable();
            $table->foreignId("product_id")->constrained("products")->cascadeOnDelete();
            $table->integer("quantity")->default(1);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists("cart_items"); }
};',

  '2026_01_01_000007_create_wishlist_items_table.php' => '<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create("wishlist_items", function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->nullable()->constrained("users")->cascadeOnDelete();
            $table->string("session_id")->nullable();
            $table->foreignId("product_id")->constrained("products")->cascadeOnDelete();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists("wishlist_items"); }
};',

  '2026_01_01_000008_create_orders_table.php' => '<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create("orders", function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->nullable()->constrained("users")->nullOnDelete();
            $table->string("customer_name");
            $table->string("customer_email");
            $table->string("phone")->nullable();
            $table->text("shipping_address");
            $table->decimal("total_amount", 10, 2);
            $table->string("status")->default("Pending Verification");
            $table->string("payment_method")->default("Cash On Delivery");
            $table->boolean("has_prescription_items")->default(false);
            $table->foreignId("prescription_id")->nullable()->constrained("prescriptions")->nullOnDelete();
            $table->string("prescription_status")->default("N/A");
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists("orders"); }
};',

  '2026_01_01_000009_create_order_items_table.php' => '<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create("order_items", function (Blueprint $table) {
            $table->id();
            $table->foreignId("order_id")->constrained("orders")->cascadeOnDelete();
            $table->foreignId("product_id")->constrained("products");
            $table->string("product_name");
            $table->decimal("price", 10, 2);
            $table->integer("quantity");
            $table->boolean("requires_prescription")->default(false);
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists("order_items"); }
};',

  '2026_01_01_000010_create_newsletter_subscribers_table.php' => '<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create("newsletter_subscribers", function (Blueprint $table) {
            $table->id();
            $table->string("email")->unique();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists("newsletter_subscribers"); }
};'
];

foreach ($migrations as $file => $content) {
    file_put_contents("$base/database/migrations/$file", $content);
}
echo "All migrations created successfully.\n";
