import Router from "express";
import { createOrder, getOrderById, getOrdersByUserId } from "../controllers/order.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createOrder);
router.get("/me", authMiddleware, getOrdersByUserId);
router.get("/:id", authMiddleware, getOrderById);

export default router;
