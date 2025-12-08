import { Router } from "express";
import {
  getProducts,
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/store.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.get("/products", getProducts);
router.post("/cart/add", verifyJWT, addToCart);
router.get("/cart", verifyJWT, getCart);
router.delete("/cart/remove/:itemId", verifyJWT, removeFromCart);

export default router;
