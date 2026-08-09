import {createUser, findUserByEmail, findUserById, findAllUsers} from '../models/user.model.js'
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

function errorMiddleware(err, req, res, next) {
    console.error(err);
    res.status(500).json({message: 'Internal server error'});
}

export const registerUser = async (req, res) => {
    const {name, email, password, phone} = req.body;
    try{
        const existingUser = await findUserByEmail(email);
        if(existingUser){
            return res.status(400).json({message: 'Email already in use'});
        }
        const hashedPassword = await bycrypt.hash(password, SALT_ROUNDS);
        const userId = await createUser({name, email, password_hash: hashedPassword, phone});
        return res.status(201).json({message: 'User created successfully', user: { id: userId, name, email, phone }});
    }catch(err){
        console.error(err);
        next();
        return res.status(500).json({message: 'Internal server error'});
    }
}


export const login = async (req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await findUserByEmail(email);
        if(!user){
            return res.status(400).json({message: 'Invalid credientials'});
        }
        const isPasswordValid = await bycrypt.compare(password, user.password_hash);
        if(!isPasswordValid){
            return res.status(400).json({message: 'Invalid credientials'});
        }
        const token = jwt.sign({
            id: user.id, email: user.email, role: user.role
        },
            process.env.JWT_SECRET,
            {expiresIn: '1h'});

            return res.status(200).json({message: 'Login successful', token});
    }catch(err){
        console.log(err)
        next()
    }
}

export const getUserProfile = async (req, res) => {
    const userId = req?.user?.id || JSON.parse(req.headers['x-user'] || '{}')?.id
    // const userId = req?.user?.id;
    if(!userId) {
        console.log('User ID not found in request', userId);
        return res.status(401).json({message: 'Unauthorized'});
    }

    try{
        const user = await findUserById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        return res.status(200).json({user});
    }catch(err){
        console.error(err);
        next();
    }
}

// ideally this should be in a separate admin controller, but for simplicity, I'm keeping it here
export const getAllUsers = async (req, res) => {
    const skip = parseInt(req.query.skip) || 0;
    try{
        const users = await findAllUsers(skip);
        return res.status(200).json({users});
    }catch(err){
        console.error(err);
        next();
    }
}
