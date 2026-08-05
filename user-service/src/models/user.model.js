import pool from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

export const createUser = async ({name, email, password_hash, phone, role="admin"}) => {
    try{
        const userId = uuidv4();
        const [result] = await pool.query("INSERT INTO users (id, name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?, ?)", [userId, name, email, password_hash, phone, role])
        console.log('user created', result)
        return userId;
    }catch(err){
        console.error(err);
        throw new Error('Error creating user');
    }
}

export const findUserById = async (id) => {
    try{
        const [rows] = await pool.query("Select * from users where id = (?)", [id])
        return rows[0] || null;
    }catch(err){
        console.error(err);
        throw new Error('Error fetching user');
    }
}

export const findUserByEmail = async (email) => {
    try{
        const [rows] = await pool.query("Select * from users where email = (?)", [email])
        return rows[0] || null;
    }catch(err){
        console.error(err);
        throw new Error('Error fetching user');
    }
}
