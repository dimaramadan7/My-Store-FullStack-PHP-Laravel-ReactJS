<?php

use App\Http\Controllers\API\OrdersController;
use App\Http\Controllers\Api\ProductsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\User;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!

sanctum - passport
|
*/

// not auth requests
Route::middleware('guest')->group(function () {
    // 1) Register
    Route::post('register', [RegisteredUserController::class, 'store']);

    // 2) Login
    Route::put('login', [AuthenticatedSessionController::class, 'store']);
    Route::get('users', [User::class, 'index']);
    // 3) Get Products
    Route::get('products', [ProductsController::class, 'GetProducts']);
    Route::get('allproducts', [ProductsController::class, 'GetAllProducts']);
    // 4) Get Categories
    Route::get('categories', [ProductsController::class, 'GetCategories']);
    Route::get('order', [ProductsController::class, 'GetOrders']);
    Route::get('users', [ProductsController::class, 'GetUser']);

    // 5) Create Category & Product & order
    Route::post('categories', [ProductsController::class, 'CreateCategories']);
    Route::post('product', [ProductsController::class, 'CreateProduct']);
    Route::post('order', [ProductsController::class, 'CreateOrder']);

    // 6) Delete Category & Product & order
    Route::delete('/categories/{id}', [ProductsController::class, 'delete']);
    Route::delete('/product/{id}', [ProductsController::class, 'deleteproduct']);
    Route::delete('/order/{id}', [ProductsController::class, 'deleteOrder']);

    // 7) update Category & Product & order
    Route::post('updateCategories', [ProductsController::class, 'updateCategories']);
    Route::post('updateProduct', [ProductsController::class, 'updateProduct']);
    Route::post('updateOrder', [ProductsController::class, 'updateOrder']);

    // StoreDetails
    Route::get('countCategories', [ProductsController::class, 'GetCountCategories']);
    Route::get('countProducts', [ProductsController::class, 'GetCountProducts']);
    Route::get('countOrders', [ProductsController::class, 'GetCountOrders']);

});


// auth requests
Route::middleware('auth:sanctum')->group(function () {
    // 1) Create orders
    Route::post('orders', [OrdersController::class, 'store']);

    // 2) Get User API Requests
    Route::get('user', function (Request $request) {
        return $request->user();
    });

    // 3) Get orders
    Route::get('orders', [OrdersController::class, 'index']);

    // 4) Modify/Update Order
    Route::put('orders', [OrdersController::class, 'update']);

    // 5) Logout User
    Route::put('logout', [AuthenticatedSessionController::class, 'logout']);
});
