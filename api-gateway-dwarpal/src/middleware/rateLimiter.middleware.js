import { requestPolicyValidator } from './auth.middleware.js';
import slidingWindowRateLimiter from './slidingWindowRateLimiter.middleware.js';
import tokenBucketRateLimiter from "./tokenBucketRateLimiter.middleware.js";

const rateLimiterMiddleware = (req, res, next) =>{
    // get the rateLimit details for specifc route
    const policy =  requestPolicyValidator(req.path)

    if (!policy) {
        return res.status(404).json({
            message: 'No policy configured for this route'
        });
    }

    // get type of rate limit (ip or token)
    const {type, service} = policy?.rateLimit

    if(type == 'ip-based'){
        return slidingWindowRateLimiter(service)(req, res, next)
    }
    if(type == 'token-based'){
        return tokenBucketRateLimiter(service)(req, res, next)
    }
}

export default rateLimiterMiddleware;
