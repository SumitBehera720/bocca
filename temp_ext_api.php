<?php
$base = '/home/u892283443/farmart-laravel';

// 1. ProductController.php (with update & destroy)
$productController = '<?php
namespace App\\Http\\Controllers\\Api;
use App\\Http\\Controllers\\Controller;
use App\\Models\\Product;
use Illuminate\\Http\\Request;

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
        if (!isset($data["image"]) || empty($data["image"])) {
            $data["image"] = $data["image_url"] ?? "/images/products/product-1.jpg";
        }
        $product = Product::create($data);
        return response()->json(["status" => "success", "message" => "Medicine created successfully", "data" => $product], 201);
    }

    public function update(Request $request, $id) {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(["status" => "error", "message" => "Product not found"], 404);
        }
        $data = $request->all();
        if (isset($data["name"])) {
            $data["product_name"] = $data["name"];
            unset($data["name"]);
        }
        if (isset($data["image_url"])) {
            $data["image"] = $data["image_url"];
        }
        $product->update($data);
        return response()->json(["status" => "success", "message" => "Product updated successfully", "data" => $product]);
    }

    public function destroy($id) {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(["status" => "error", "message" => "Product not found"], 404);
        }
        $product->delete();
        return response()->json(["status" => "success", "message" => "Product deleted successfully"]);
    }
}';
file_put_contents("$base/app/Http/Controllers/Api/ProductController.php", $productController);

// 2. UserController.php
$userController = '<?php
namespace App\\Http\\Controllers\\Api;
use App\\Http\\Controllers\\Controller;
use App\\Models\\User;
use Illuminate\\Http\\Request;

class UserController extends Controller {
    public function index() {
        return response()->json(["status" => "success", "data" => User::orderBy("id", "desc")->get()]);
    }

    public function updateRole(Request $request, $id) {
        $user = User::find($id);
        if (!$user) {
            return response()->json(["status" => "error", "message" => "User not found"], 404);
        }
        $user->update(["role" => $request->role ?? "customer"]);
        return response()->json(["status" => "success", "message" => "User role updated successfully", "data" => $user]);
    }
}';
file_put_contents("$base/app/Http/Controllers/Api/UserController.php", $userController);

// 3. CategoryController.php (CRUD)
$categoryController = '<?php
namespace App\\Http\\Controllers\\Api;
use App\\Http\\Controllers\\Controller;
use App\\Models\\Category;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Str;

class CategoryController extends Controller {
    public function index() {
        return response()->json(["status" => "success", "data" => Category::all()]);
    }

    public function store(Request $request) {
        $category = Category::create([
            "name" => $request->name,
            "slug" => Str::slug($request->name),
            "image" => $request->image ?? "/images/categories/category-1.png",
            "description" => $request->description ?? ""
        ]);
        return response()->json(["status" => "success", "message" => "Category created", "data" => $category], 201);
    }

    public function update(Request $request, $id) {
        $category = Category::find($id);
        if (!$category) return response()->json(["status" => "error", "message" => "Category not found"], 404);
        $category->update($request->all());
        return response()->json(["status" => "success", "message" => "Category updated", "data" => $category]);
    }

    public function destroy($id) {
        $category = Category::find($id);
        if (!$category) return response()->json(["status" => "error", "message" => "Category not found"], 404);
        $category->delete();
        return response()->json(["status" => "success", "message" => "Category deleted"]);
    }
}';
file_put_contents("$base/app/Http/Controllers/Api/CategoryController.php", $categoryController);

// 4. BrandController.php (CRUD)
$brandController = '<?php
namespace App\\Http\\Controllers\\Api;
use App\\Http\\Controllers\\Controller;
use App\\Models\\Brand;
use Illuminate\\Http\\Request;

class BrandController extends Controller {
    public function index() {
        return response()->json(["status" => "success", "data" => Brand::all()]);
    }

    public function store(Request $request) {
        $brand = Brand::create([
            "brand_name" => $request->brand_name ?? $request->name,
            "title" => $request->title ?? $request->brand_name ?? $request->name,
            "image" => $request->image ?? "/images/brands/brand-1.png",
            "link" => $request->link ?? "#"
        ]);
        return response()->json(["status" => "success", "message" => "Brand created", "data" => $brand], 201);
    }

    public function update(Request $request, $id) {
        $brand = Brand::find($id);
        if (!$brand) return response()->json(["status" => "error", "message" => "Brand not found"], 404);
        $brand->update($request->all());
        return response()->json(["status" => "success", "message" => "Brand updated", "data" => $brand]);
    }

    public function destroy($id) {
        $brand = Brand::find($id);
        if (!$brand) return response()->json(["status" => "error", "message" => "Brand not found"], 404);
        $brand->delete();
        return response()->json(["status" => "success", "message" => "Brand deleted"]);
    }
}';
file_put_contents("$base/app/Http/Controllers/Api/BrandController.php", $brandController);

// 5. ReviewController.php
$reviewController = '<?php
namespace App\\Http\\Controllers\\Api;
use App\\Http\\Controllers\\Controller;
use App\\Models\\Review;
use Illuminate\\Http\\Request;

class ReviewController extends Controller {
    public function index() {
        return response()->json(["status" => "success", "data" => Review::with("product")->orderBy("id", "desc")->get()]);
    }

    public function destroy($id) {
        $review = Review::find($id);
        if (!$review) return response()->json(["status" => "error", "message" => "Review not found"], 404);
        $review->delete();
        return response()->json(["status" => "success", "message" => "Review deleted successfully"]);
    }
}';
file_put_contents("$base/app/Http/Controllers/Api/ReviewController.php", $reviewController);

// 6. Updated api.php
$apiRoutes = '<?php
use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\AuthController;
use App\\Http\\Controllers\\Api\\ProductController;
use App\\Http\\Controllers\\Api\\CategoryController;
use App\\Http\\Controllers\\Api\\BrandController;
use App\\Http\\Controllers\\Api\\PrescriptionController;
use App\\Http\\Controllers\\Api\\OrderController;
use App\\Http\\Controllers\\Api\\UserController;
use App\\Http\\Controllers\\Api\\ReviewController;

Route::post("/auth/register", [AuthController::class, "register"]);
Route::post("/auth/login", [AuthController::class, "login"]);
Route::get("/auth/me", [AuthController::class, "me"]);

Route::get("/products", [ProductController::class, "index"]);
Route::get("/products/{id}", [ProductController::class, "show"]);
Route::post("/products", [ProductController::class, "store"]);
Route::put("/products/{id}", [ProductController::class, "update"]);
Route::delete("/products/{id}", [ProductController::class, "destroy"]);

Route::get("/categories", [CategoryController::class, "index"]);
Route::post("/categories", [CategoryController::class, "store"]);
Route::put("/categories/{id}", [CategoryController::class, "update"]);
Route::delete("/categories/{id}", [CategoryController::class, "destroy"]);

Route::get("/brands", [BrandController::class, "index"]);
Route::post("/brands", [BrandController::class, "store"]);
Route::put("/brands/{id}", [BrandController::class, "update"]);
Route::delete("/brands/{id}", [BrandController::class, "destroy"]);

Route::get("/prescriptions", [PrescriptionController::class, "index"]);
Route::post("/prescriptions/upload", [PrescriptionController::class, "store"]);
Route::patch("/prescriptions/{id}/status", [PrescriptionController::class, "updateStatus"]);

Route::get("/orders", [OrderController::class, "index"]);
Route::post("/orders", [OrderController::class, "store"]);
Route::patch("/orders/{id}/status", [OrderController::class, "updateStatus"]);

Route::get("/users", [UserController::class, "index"]);
Route::patch("/users/{id}/role", [UserController::class, "updateRole"]);

Route::get("/reviews", [ReviewController::class, "index"]);
Route::delete("/reviews/{id}", [ReviewController::class, "destroy"]);
';

file_put_contents("$base/routes/api.php", $apiRoutes);
echo "All extended controllers and API routes deployed successfully.\n";
