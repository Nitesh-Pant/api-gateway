import express from "express";
import dotenv from "dotenv";
import authMiddleware from "./middleware/auth.middleware.js";
import policies from './config/policies.js';
import ordersProxyMiddleware from "./middleware/orderProxy.middleware.js";
import usersProxyMiddleware from './middleware/userProxy.middleware.js';

dotenv.config();

const app = express();

console.log('policies:', policies);

app.use(authMiddleware)

app.use('/users', usersProxyMiddleware)
app.use("/orders", ordersProxyMiddleware)


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});
