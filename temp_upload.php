<?php
$base = '/home/u892283443/farmart-laravel';

@mkdir("$base/public/uploads", 0777, true);

// 1. UploadController.php
$uploadController = '<?php
namespace App\\Http\\Controllers\\Api;
use App\\Http\\Controllers\\Controller;
use Illuminate\\Http\\Request;

class UploadController extends Controller {
    public function upload(Request $request) {
        $file = $request->file("file") ?? $request->file("image");
        if ($file) {
            $filename = time() . "_" . uniqid() . "." . $file->getClientOriginalExtension();
            $file->move(public_path("uploads"), $filename);
            $url = url("uploads/" . $filename);
            return response()->json([
                "status" => "success",
                "message" => "Image uploaded successfully from device",
                "url" => $url
            ]);
        }
        return response()->json(["status" => "error", "message" => "No file uploaded"], 400);
    }
}';
file_put_contents("$base/app/Http/Controllers/Api/UploadController.php", $uploadController);

// 2. Add route in routes/api.php
$apiFile = "$base/routes/api.php";
$content = file_get_contents($apiFile);
if (strpos($content, "UploadController") === false) {
    $content = str_replace(
        "use App\\Http\\Controllers\\Api\\ReviewController;",
        "use App\\Http\\Controllers\\Api\\ReviewController;
use App\\Http\\Controllers\\Api\\UploadController;",
        $content
    );
    $content .= "
Route::post("/upload", [UploadController::class, "upload"]);
";
    file_put_contents($apiFile, $content);
}

chmod("$base/public/uploads", 0777);
echo "UploadController deployed and /api/upload endpoint ready.\n";
