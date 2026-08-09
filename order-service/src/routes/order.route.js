import Router from "express";
import { createOrder, getOrderById, getOrdersByUserId, getAllOrders } from "../controllers/order.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", /* authMiddleware, */ createOrder); // auth removed as it is handled in api-gateway-dwarpal
router.get("/me", /* authMiddleware, */ getOrdersByUserId);
router.get("/:id", /* authMiddleware, */ getOrderById);
router.get('/a/orders',  getAllOrders)

export default router;
