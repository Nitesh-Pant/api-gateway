import pool from "../config/db.js";

export const createOrderRecord = async ({ user_id, product_id, quantity, total_price }) => {
    try {
        const [result] = await pool.query(
            "INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)",
            [user_id, product_id, quantity, total_price]
        );
        console.log("order created", result);
        return result.insertId;
    } catch (err) {
        console.error(err);
        throw new Error("Error creating order");
    }
};

export const findOrderById = async (id) => {
    try {
        const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [id]);
        return rows[0] || null;
    } catch (err) {
        console.error(err);
        throw new Error("Error fetching order");
    }
};

export const findOrdersByUserId = async (user_id) => {
    try {
        const [rows] = await pool.query("SELECT * FROM orders WHERE user_id = ?", [user_id]);
        return rows;
    } catch (err) {
        console.error(err);
        throw new Error("Error fetching orders for user");
    }
};

// ideally this should be in a separate admin model, but for simplicity, I'm keeping it here
export const findAllOrders= async (skip=0) => {
    try {
        const [rows] = await pool.query("SELECT * FROM orders order by created_at desc limit 50 offset ?", [skip]);
        return rows;
    } catch (err) {
        console.error(err);
        throw new Error("Error fetching orders for user");
    }
};
