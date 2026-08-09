import express from "express";
import dotenv from "dotenv";
import {createProxyMiddleware} from "http-proxy-middleware";
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

const urlWhitelist = [
    "/users/register",
    "/users/login",
]


const authMiddleware = (req, res, next) => {
    if(urlWhitelist.includes(req.url)){
        next();
        return;
    }
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }
    try {
        const decoded = jwt.verify(token, "XyZ123b0!9Ss" || process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
app.use(authMiddleware)

const ordersProxyMiddleware = createProxyMiddleware({
    target: "http://localhost:4002",
    changeOrigin: true,
    logLevel: "debug"
})
const usersProxyMiddleware = createProxyMiddleware({
    target: "http://localhost:4001",
    changeOrigin: true,
    logLevel: "debug"
})



app.use('/users', usersProxyMiddleware)
app.use("/orders", ordersProxyMiddleware)

app.listen(process.env.PORT || 4000, () => {
    console.log(`API Gateway is running on port ${process.env.PORT || 4000}`);
});
