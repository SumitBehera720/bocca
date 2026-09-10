<?php
$base = '/home/u892283443/farmart-laravel';

@mkdir("$base/app/Http/Controllers/Api", 0755, true);
@mkdir("$base/app/Models", 0755, true);

// 1. Models
$models = [
  'User.php' => '<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens, Notifiable;
    protected $fillable = ["name", "email", "password", "role"];
    protected $hidden = ["password", "remember_token"];
}',
  'Category.php' => '<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Category extends Model { protected $guarded = []; }',
  'Brand.php' => '<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Brand extends Model { protected $guarded = []; }',
  'Product.php' => '<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Product extends Model {
    protected $guarded = [];
    public function brand() { return $this->belongsTo(Brand::class); }
    public function reviews() { return $this->hasMany(Review::class); }
}',
  'Review.php' => '<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Review extends Model { protected $guarded = []; }',
  'Prescription.php' => '<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Prescription extends Model { protected $guarded = []; }',
  'CartItem.php' => '<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class CartItem extends Model {
    protected $guarded = [];
    public function product() { return $this->belongsTo(Product::class); }
}',
  'WishlistItem.php' => '<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class WishlistItem extends Model {
    protected $guarded = [];
    public function product() { return $this->belongsTo(Product::class); }
}',
  'Order.php' => '<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Order extends Model {
    protected $guarded = [];
    public function items() { return $this->hasMany(OrderItem::class); }
}',
  'OrderItem.php' => '<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class OrderItem extends Model { protected $guarded = []; }'
];

foreach ($models as $file => $code) {
    file_put_contents("$base/app/Models/$file", $code);
}

// 2. Controllers
$controllers = [
  'AuthController.php' => '<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller {
    public function register(Request $request) {
        $validated = $request->validate([
            "name" => "required|string|max:255",
            "email" => "required|string|email|unique:users",
            "password" => "required|string|min:6",
            "role" => "nullable|string"
        ]);

        $user = User::create([
            "name" => $validated["name"],
            "email" => $validated["email"],
            "password" => Hash::make($validated["password"]),
            "role" => $validated["role"] ?? "customer"
        ]);

        $token = $user->createToken("auth_token")->plainTextToken;

        return response()->json([
            "status" => "success",
            "message" => "Account created successfully!",
            "data" => [
                "user" => $user,
                "token" => $token
            ]
        ], 201);
    }

    public function login(Request $request) {
        $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);

        $user = User::where("email", $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(["status" => "error", "message" => "Invalid credentials"], 401);
        }

        $token = $user->createToken("auth_token")->plainTextToken;

        return response()->json([
            "status" => "success",
            "message" => "Logged in successfully",
            "data" => [
                "user" => $user,
                "token" => $token
            ]
        ]);
    }

    public function me(Request $request) {
        return response()->json(["status" => "success", "data" => $request->user()]);
    }
}',

  'ProductController.php' => '<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller {
    public function index(Request $request) {
        $query = Product::with("reviews");

        if ($request->has("search")) {
            $query->where("product_name", "like", "%" . $request->search . "%");
        }
        if ($request->has("category_id")) {
            $query->where("category_id", $request->category_id);
        }
        if ($request->has("brand_id")) {
            $query->where("brand_id", $request->brand_id);
        }
        if ($request->has("is_top_saver")) {
            $query->where("is_top_saver", 1);
        }
        if ($request->has("is_best_seller")) {
            $query->where("is_best_seller", 1);
        }

        $products = $query->orderBy("id", "desc")->get();

        return response()->json([
            "status" => "success",
            "data" => $products
        ]);
    }

    public function show($id) {
        $product = Product::with("reviews")->find($id);
        if (!$product) {
            return response()->json(["status" => "error", "message" => "Product not found"], 404);
        }
        return response()->json(["status" => "success", "data" => $product]);
    }

    public function store(Request $request) {
        $data = $request->all();
        if (isset($data["name"])) {
            $data["product_name"] = $data["name"];
            unset($data["name"]);
        }
        if (!isset($data["image"])) {
            $data["image"] = $data["image_url"] ?? "/images/products/product-1.jpg";
        }
        $product = Product::create($data);
        return response()->json(["status" => "success", "message" => "Medicine created successfully", "data" => $product], 201);
    }
}',

  'CategoryController.php' => '<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Category;

class CategoryController extends Controller {
    public function index() {
        return response()->json(["status" => "success", "data" => Category::all()]);
    }
}',

  'BrandController.php' => '<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Brand;

class BrandController extends Controller {
    public function index() {
        return response()->json(["status" => "success", "data" => Brand::all()]);
    }
}',

  'PrescriptionController.php' => '<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Prescription;
use Illuminate\Http\Request;

class PrescriptionController extends Controller {
    public function index() {
        return response()->json(["status" => "success", "data" => Prescription::orderBy("id", "desc")->get()]);
    }

    public function store(Request $request) {
        $prescriptionFile = $request->prescriptionFile ?? $request->file ?? "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500";
        $prescription = Prescription::create([
            "patient_name" => $request->patientName ?? "Patient",
            "doctor_name" => $request->doctorName ?? "Dr. Unspecified",
            "prescription_file" => $prescriptionFile,
            "status" => "pending",
            "notes" => $request->notes ?? ""
        ]);
        return response()->json(["status" => "success", "message" => "Prescription uploaded successfully", "data" => $prescription], 201);
    }

    public function updateStatus(Request $request, $id) {
        $prescription = Prescription::find($id);
        if (!$prescription) {
            return response()->json(["status" => "error", "message" => "Prescription not found"], 404);
        }
        $prescription->update([
            "status" => $request->status ?? $prescription->status,
            "notes" => $request->pharmacistNotes ?? $request->notes ?? $prescription->notes
        ]);
        return response()->json(["status" => "success", "message" => "Prescription updated", "data" => $prescription]);
    }
}',

  'OrderController.php' => '<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller {
    public function index() {
        return response()->json(["status" => "success", "data" => Order::with("items")->orderBy("id", "desc")->get()]);
    }

    public function store(Request $request) {
        $order = Order::create([
            "customer_name" => $request->customerName,
            "customer_email" => $request->customerEmail,
            "phone" => $request->phone ?? "",
            "shipping_address" => $request->shippingAddress,
            "total_amount" => $request->totalAmount,
            "payment_method" => $request->paymentMethod ?? "Cash On Delivery",
            "has_prescription_items" => $request->hasPrescriptionItems ? 1 : 0,
            "prescription_id" => $request->prescriptionId ?? null,
            "status" => "Pending Verification"
        ]);

        if (is_array($request->items)) {
            foreach ($request->items as $item) {
                OrderItem::create([
                    "order_id" => $order->id,
                    "product_id" => $item["product_id"] ?? $item["id"],
                    "product_name" => $item["product_name"] ?? $item["name"],
                    "price" => $item["price"],
                    "quantity" => $item["quantity"] ?? 1
                ]);
            }
        }

        return response()->json(["status" => "success", "message" => "Order placed successfully", "data" => $order], 201);
    }

    public function updateStatus(Request $request, $id) {
        $order = Order::find($id);
        if (!$order) {
            return response()->json(["status" => "error", "message" => "Order not found"], 404);
        }
        $order->update(["status" => $request->status]);
        return response()->json(["status" => "success", "message" => "Order status updated", "data" => $order]);
    }
}'
];

foreach ($controllers as $file => $code) {
    file_put_contents("$base/app/Http/Controllers/Api/$file", $code);
}

// 3. API Routes (routes/api.php)
$apiRoutes = '<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\PrescriptionController;
use App\Http\Controllers\Api\OrderController;

Route::post("/auth/register", [AuthController::class, "register"]);
Route::post("/auth/login", [AuthController::class, "login"]);

Route::get("/products", [ProductController::class, "index"]);
Route::get("/products/{id}", [ProductController::class, "show"]);
Route::post("/products", [ProductController::class, "store"]);

Route::get("/categories", [CategoryController::class, "index"]);
Route::get("/brands", [BrandController::class, "index"]);

Route::get("/prescriptions", [PrescriptionController::class, "index"]);
Route::post("/prescriptions/upload", [PrescriptionController::class, "store"]);
Route::patch("/prescriptions/{id}/status", [PrescriptionController::class, "updateStatus"]);

Route::get("/orders", [OrderController::class, "index"]);
Route::post("/orders", [OrderController::class, "store"]);
Route::patch("/orders/{id}/status", [OrderController::class, "updateStatus"]);
';

file_put_contents("$base/routes/api.php", $apiRoutes);
echo "Controllers and API Routes created successfully.\n";
