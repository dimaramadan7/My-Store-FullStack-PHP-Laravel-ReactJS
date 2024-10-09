<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;


class ProductsController extends Controller
{

    public function GetAllProducts(): JsonResponse
    {
        $proudcts = Product::get();
        return response()->json([
            'message' => 'products has been retreived successfully',
            'data' => $proudcts,
        ], 200);
    }
    public function  GetCountProducts(): JsonResponse
    {
        $productsCount = Product::count();

        return response()->json([
            'message' => 'Products count has been retrieved successfully',
            'count' => $productsCount,
        ], 200);
    }

    public function GetProducts(Request $request): JsonResponse
    {
        // init request parameters
        $name = $request->name;
        $category = $request->category;

        $proudcts = Product::get();

        // filter by name
        if (!empty($name)) {
            $proudcts = $proudcts->where('name', $name);
        }

        // filter by category
        if (!empty($category)) {
            $proudcts = $proudcts->where('category', $category);
        }

        return response()->json([
            'message' => 'products has been retreived successfully',
            'data' => $proudcts,
        ], 200);
    }
    public function CreateProduct(Request $request): JsonResponse
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20480', // Assuming image upload, adjust validation rules as needed
            'price' => 'nullable|string',
            'category' => 'nullable|string',
        ]);

        $product = new Product();
        $product->name = $validatedData['name'];
        $product->description = $validatedData['description'];
        $product->price = $validatedData['price'];
        $product->category = $validatedData['category'];

        if ($request->hasFile('image')) {
            $image = $request->file('image');

            // Read image file content
            $imageData = file_get_contents($image->getRealPath());

            // Encode image data as base64
            $base64Image = base64_encode($imageData);

            // Set the base64-encoded image data in the response
            $product->image = $base64Image;
        }
        $product->save();

        // Return the response
        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product,
        ], 201);
    }

    public function updateProduct(Request $request): JsonResponse
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20480', // Assuming image upload, adjust validation rules as needed
            'price' => 'nullable|string',
            'category' => 'nullable|string',
        ]);

        // Find the product by its ID
        $product = Product::findOrFail($request->id);

        // Update the product properties
        $product->name = $validatedData['name'];
        $product->description = $validatedData['description'];
        $product->price = $validatedData['price'];
        $product->category = $validatedData['category'];

        if ($request->hasFile('image')) {
            $image = $request->file('image');

            // Read image file content
            $imageData = file_get_contents($image->getRealPath());

            // Encode image data as base64
            $base64Image = base64_encode($imageData);

            // Set the base64-encoded image data in the response
            $product->image = $base64Image;
        }

        // Save the updated product
        $product->save();

        // Return the response
        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product,
        ], 200);
    }

    public function  GetCountCategories(): JsonResponse
    {
        $categoriesCount = Category::count();

        return response()->json([
            'message' => 'Categories count has been retrieved successfully',
            'count' => $categoriesCount,
        ], 200);
    }
    public function  GetCategories(): JsonResponse
    {
        $categories = Category::all();

        return response()->json([
            'message' => 'Categroies has been retreived successfully',
            'data' => $categories,
        ], 200);
    }
    public function updateCategories(Request $request)
    {
        // get & check category
        $category = Category::find($request->id);

        // check category
        if (!$category) {
            return response()->json([
                'message' => 'Category is not found',
            ], 404);
        }

        // Validate the incoming request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20480', // Assuming image upload, adjust validation rules as needed
        ]);

        // Update the category
        $category->name = $validatedData['name']; // Correct way to access the 'name' field
        $category->desc = $validatedData['desc'] ?? $category->desc; // Using null coalescing operator to retain the old value if 'desc' is not provided

        // // Handle image update if provided
        if ($request->hasFile('image')) {
            $image = $request->file('image');

            // Read image file content
            $imageData = file_get_contents($image->getRealPath());

            // Encode image data as base64
            $base64Image = base64_encode($imageData);

            // Update the category image with base64 encoded data
            $category->image = $base64Image;
        }
        // Save the updated category
        $category->save();

        return response()->json([
            'message' => 'Category updated successfully',
            'category' => $category, // Returning the updated category
        ], 200);
    }

    public function CreateCategories(Request $request): JsonResponse
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'desc' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20480', // Assuming image upload, adjust validation rules as needed
        ]);

        // data from front end to DB
        $category = new Category();
        $category->name = $validatedData['name'];
        $category->desc = $validatedData['desc'];

        if ($request->hasFile('image')) {
            $image = $request->file('image');

            // Read image file content
            $imageData = file_get_contents($image->getRealPath());

            // Encode image data as base64
            $base64Image = base64_encode($imageData);

            // Set the base64-encoded image data in the response
            $category->image = $base64Image;
        }
        $category->save();

        // Return the response
        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category,
        ], 201);
    }
    public function deleteproduct($id): JsonResponse
    {
        // Find the category by ID
        $product = Product::find($id);

        // Check if the category exists
        if (!$product) {
            return response()->json([
                'message' => 'product not found'
            ], 404);
        }

        // Delete the category
        $product->delete();

        // Return a success response
        return response()->json([
            'message' => 'product deleted successfully'
        ], 200);
    }
    public function delete($id): JsonResponse
    {
        // Find the category by ID
        $category = Category::find($id);

        // Check if the category exists
        if (!$category) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        }

        // Delete the category
        $category->delete();

        // Return a success response
        return response()->json([
            'message' => 'Category deleted successfully'
        ], 200);
    }

    public function  GetCountOrders(): JsonResponse
    {
        $ordersCount = Order::count();

        return response()->json([
            'message' => 'Order count has been retrieved successfully',
            'count' => $ordersCount,
        ], 200);
    }
    public function  GetOrders(): JsonResponse
    {
        $orders = Order::all();

        return response()->json([
            'message' => 'Order has been retreived successfully',
            'data' => $orders,
        ], 200);
    }
    public function createOrder(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'user_id' => ['required', 'nullable'],
            'total' => 'nullable|string',
            'date' => 'nullable|date',
        ]);

        $order = new Order();
        $order->user_id = $validatedData['user_id'];
        $order->total = $validatedData['total'];

        // Format the date using Carbon
        $order->date = Carbon::createFromFormat('Y-m-d', $validatedData['date'])->format('Y-m-d');

        $order->save();

        // Return the response
        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order,
        ], 201);
    }

    public function updateOrder(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'user_id' => ['nullable'],
            'total' => 'nullable|string',
            'date' => 'nullable|date',
        ]);

        $order = Order::findOrFail($request->id);

        if (isset($validatedData['user_id'])) {
            $order->user_id = $validatedData['user_id'];
        }
        if (isset($validatedData['total'])) {
            $order->total = $validatedData['total'];
        }
        if (isset($validatedData['date'])) {
            $order->date = Carbon::createFromFormat('d-m-Y', $validatedData['date'])->format('Y-m-d');
        }

        $order->save();

        return response()->json([
            'message' => 'Order updated successfully',
            'order' => $order,
        ], 200);
    }
    public function deleteOrder($orderId): JsonResponse
    {
        $order = Order::findOrFail($orderId);

        $order->delete();

        return response()->json([
            'message' => 'Order deleted successfully',
        ], 200);
    }


    public function  GetUser(): JsonResponse
    {
        $user = User::all();

        return response()->json([
            'message' => 'User has been retreived successfully',
            'data' => $user,
        ], 200);
    }
}
