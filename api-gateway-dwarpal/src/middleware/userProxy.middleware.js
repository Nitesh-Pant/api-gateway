import {createProxyMiddleware} from "http-proxy-middleware";

const usersProxyMiddleware = createProxyMiddleware({
    target: "http://localhost:4001",
    changeOrigin: true,
    logLevel: "debug",
    pathRewrite:{
        "^/users": ""
    }
})

export default usersProxyMiddleware
