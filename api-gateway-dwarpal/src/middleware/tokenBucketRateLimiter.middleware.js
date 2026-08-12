import redisClient from "../config/redis.js";
import CONSTANTS from "../constants/rateLimiter.constants.js";
import rateLimiterConfig from "../config/rate-limiter.policies.js";

/*
    the flow,
     - capacity of bucket is 5 req
     - refill rate is 5 req / minute (1 req in 12 sec - constant flow)
     - intial token avaible is 5
*/

const tokenBucketRateLimiter = (service) => {
    console.log(service)

    return async (req, res, next)=>{
        let userId = req.user.id

        let key = `rate-limit:${service}:${userId}`

        let redisData  = await redisClient.get(key)

        let userBucket;

        if(!redisData){
            userBucket = {
                capacity: rateLimiterConfig[service].capacity, /* CONSTANTS.CAPACITY, */
                refillRate:  rateLimiterConfig[service].refillRate, /* CONSTANTS.REFILL_RATE, */  // per minute
                tokens: rateLimiterConfig[service].initialToken/* CONSTANTS.TOKENS */,
                lastRefill: Date.now()
            }
            await redisClient.set(key, JSON.stringify(userBucket), {EX: CONSTANTS.TTL}) // TTL is 300 (3 min)
        }else{
            userBucket = JSON.parse(redisData || '{}')
        }

    /*
        1 sec = 1000 millisec
        1 min = 60000 millisec
        5 token per mintute
        therefore 5 token per 60000 millisec  => 1 token / 12000 millisec
    */


        const nowTime = Date.now()

        // time taken to generate 1 token (in millisec) [12 sec or 12000 millisec]
        let refillToken = (60000 / userBucket.refillRate)

        // time passed between, current and lastrefill (in millisec)
        const elapsedTime = nowTime - userBucket.lastRefill

        // time passed b/w current and last refilltime >= 12 (as 12 is the refiiltoken time) as add one token to bucket and update the lastrefill
        if(elapsedTime >= refillToken){
            // how many token generate in the time frame (means if 12 sec passed then 1 token should be add or 24 sec then 2 token and if 60 sec 5 needs to be added)
            const tokenGenerate = Math.floor(elapsedTime / refillToken); // exmaple: 36 sec / 12 sec => 3 tokens generate in the meantime

            // either 5 or 4,3,2,1
            userBucket.tokens = Math.min(userBucket.capacity, userBucket.tokens + tokenGenerate);

            userBucket.lastRefill = nowTime
        }

        if(userBucket.tokens < 1){
            return res.status(429).send("Too many request")
        }

        userBucket.tokens -= 1;
        console.log('after eating,', userBucket)

        // Save updated bucket back to Redis
        await redisClient.set(
            key,
            JSON.stringify(userBucket),{
                EX: CONSTANTS.TTL
            }
        );


        next()
    }


}

export default tokenBucketRateLimiter;
