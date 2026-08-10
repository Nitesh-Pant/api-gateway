import {createProxyMiddleware} from "http-proxy-middleware";

const ordersProxyMiddleware = createProxyMiddleware({
    target: "http://localhost:4002",
    changeOrigin: true,
    logLevel: "debug"
})

export default ordersProxyMiddleware
