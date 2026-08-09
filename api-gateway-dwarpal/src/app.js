import express from "express";
import dotenv from "dotenv";
import {createProxyMiddleware} from "http-proxy-middleware";
import jwt from 'jsonwebtoken';
import policies from './config/policies.js';


dotenv.config();

const app = express();

console.log('policies:', policies);

const requestPolicyValidator = (url)=>{
    console.log('url,', url)
    return policies.find(policy=>{
        const policyPartsArr = policy.path.split('/')   // ["", user, id]
        const urlPartsArr = url.split('/')              // ["", user, 921nacsa781bd]

        if(policyPartsArr.length != urlPartsArr.length){
            return false
        }
        return policyPartsArr.every((part, indx)=>{
            return part.startsWith(':') || part == urlPartsArr[indx]    // check each value of policyPartsArr with urlPartsArr , check if url has :
        })
    })
}


const authMiddleware = (req, res, next) => {

    const policy = requestPolicyValidator(req.url)

    const auth = policy['auth']
    const role = policy['role']

    if(!auth){
        next();
        return;
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "XyZ123b0!9Ss");
        req.user = decoded;

        req.headers['x-user'] = JSON.stringify(decoded)
        if(role){
            if(role.includes(req.user.role)){
                next();
                return;
            }else{
                return res.status(403).json({ message: 'Forbidden' });
            }
        }
        next();
    } catch (err) {
        console.log('auth failed:', err.message);
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
