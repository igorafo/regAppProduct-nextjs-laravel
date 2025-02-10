<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|decimal:2',
            'available' => 'required|boolean'
        ]);

        $product = Product::create($validated);
        return response()->json($product,201);
    }

    public function index(){
        return response()->json([
            'products' => Product::all()
        ]);
    }

    public function update(Request $request, $id) {

        //\Log::info('Incoming request data:', $request->all());

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'string',
            'price' => 'decimal:2',
            'available' => 'boolean'
        ]);

        $product = Product::find($id);

        $product->update($request->all());
        
        return response()->json($product);
    }
}
