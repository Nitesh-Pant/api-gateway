import redisClient from "../config/redis.js"
import CONSTANTS from "../constants/rateLimiter.constants.js"

const slidingWindowRateLimiter = (service) =>{
    console.log(service)

    return async (req, res, next)=>{

        let limit = CONSTANTS.PUBLIC_REQ_LIMIT
        let key = `rate-limit-ip:${service}:${req.ip}`

        let slide = await redisClient.get(key)

        if(!slide){
            slide = {
                timeWindow: []
            }

            await redisClient.set(key, JSON.stringify(slide), {EX: CONSTANTS.TTL})

        }else{
            slide  = JSON.parse(slide)
        }

        // store only req which came in last 1 min
        slide.timeWindow = slide.timeWindow?.filter((time) => (Date.now() - time) < 60000)

        // check if timestamp array length > limit (5)
        if(slide.timeWindow.length >= limit){
            return res.status(429).send("Too many request")
        }
        slide.timeWindow.push(Date.now())

        await redisClient.set(key, JSON.stringify(slide), {EX: CONSTANTS.TTL})

        next()
    }

}

export default slidingWindowRateLimiter;


// static sliding window for refrence

// const slidingWindowRateLimiter = (service) =>{
//     let mp = new Map()
//     let limit = 5
//     let key = `user:${req.ip}`
//     let slide = mp.get(key)
//     // let timeWindow = [];
//     if(!slide){
//         slide = {
//             timeWindow: []
//         }
//         mp.set(key, slide)
//     }

//     slide.timeWindow = slide.timeWindow.filter((time) => (Date.now() - time) < 60000)
//     // mp.set(key, updateTimeWindow)
//     if(slide.timeWindow.length >= limit){
//         return res.status(429).send("Too many request")
//     }
//     slide.timeWindow.push(Date.now())
//     mp.set(key, slide)
// }

// export default slidingWindowRateLimiter;
