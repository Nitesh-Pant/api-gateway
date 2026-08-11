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

let bucket = {
    capacity: 5,
    refillRate: 5,
    tokens: 5,
    lastRefill: new Date()
}
let bucketMp = new Map()

const userRateLimitMiddleware = (req, res, next)=>{
    // console.log(bucket)
    let userId = req.user.id
    let userBucket = bucketMp.get(userId)
    if(!userBucket){
         bucket = {
            capacity: 5,
            refillRate: 5,  // per minute
            tokens: 5,
            lastRefill: new Date()
        }
        bucketMp.set(req.user.id, bucket)
        userBucket = bucketMp.get(req.user.id)

    }
    console.log('userid', userId)
    console.log('userBucket', userBucket)
    const timeDiff = new Date() - userBucket.lastRefill;
    // console.log('timefidd', timeDiff)
    // const sec = timeDiff / 1000;
    // const minute = (timeDiff / 1000 ) / 60;
    // const hour = minute / 60;

    // console.log('sec, min, hour', sec, minute, hour)

// calucate how mauch time is needed to fill 1 token (in milliseconds)
    let refillToken = (60 / userBucket.refillRate) * 1000

    // current time - last refill time >= 12 (as 12 is the refiiltoken time) as add one token to bucket and update the lastrefill
    if((new Date() - userBucket.lastRefill) >= refillToken){
        // userBucket.tokens += userBucket.tokens < userBucket.capacity ? 1: 0
        // how many token generate in the time frame (means if 12 sec passed then 1 token should be add or 24 sec then 2 token and if 60 sec 5 needs to be added)
        const tokenGenerate = Math.floor((new Date() - userBucket.lastRefill) / refillToken);

        // either 5 or 4,3,2,1
        userBucket.tokens = Math.min(userBucket.capacity, userBucket.tokens + tokenGenerate);
        userBucket.lastRefill = new Date()
    }

    // this is kind of fixed counter (every 1 min add 5 token) (problem is on :59 sec i used 5 req and on :01 i used 5 again , overall 10 req)
    // if(minute >=1 ){
    //     userBucket.tokens = 5 || Math.max(userBucket.tokens, 5)
    //     userBucket.lastRefill = new Date()
    // }
    if(userBucket.tokens < 1){
        return res.status(429).send("Too many request")
    }
    console.log('bcuker right before', userBucket.tokens)

    userBucket.tokens -= 1;

    console.log('bcuker right now', userBucket.tokens)

    next()
}

app.use('/users', userRateLimitMiddleware, usersProxyMiddleware)
app.use("/orders", ordersProxyMiddleware)


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});
