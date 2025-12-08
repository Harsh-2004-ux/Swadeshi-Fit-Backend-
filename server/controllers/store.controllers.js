import { asyncHandler } from "../utils/Asynchandler.js";
import { Product } from "../models/product.models.js";
import { Cart } from "../models/cart.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Get All Products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

// Add Product to Cart
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) throw new ApiError(400, "ProductId is required");

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(
    (i) => i.product.toString() === productId
  );
  if (existingItem) {
    existingItem.quantity += quantity || 1;
  } else {
    cart.items.push({ product: productId, quantity: quantity || 1 });
  }

  // Update totalPrice
  await cart.populate("items.product");
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  await cart.save();
  res
    .status(200)
    .json(new ApiResponse(200, cart, "Added to cart successfully"));
});

// Get User Cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );
  if (!cart)
    return res
      .status(200)
      .json(new ApiResponse(200, { items: [], totalPrice: 0 }, "Cart empty"));
  res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

// Remove item from cart
const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, "Cart not found");

  cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
  await cart.populate("items.product");
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  await cart.save();
  res.status(200).json(new ApiResponse(200, cart, "Item removed successfully"));
});

export { getProducts, addToCart, getCart, removeFromCart };
