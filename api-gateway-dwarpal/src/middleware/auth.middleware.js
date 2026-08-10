
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import policies from '../config/policies.js';

dotenv.config();

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
        const decoded = jwt.verify(token, process.env.JWT_SECRET );
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

export default authMiddleware;
