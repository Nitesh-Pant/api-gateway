import {createOrderRecord, findOrderById, findOrdersByUserId, findAllOrders} from "../model/order.model.js";
import products from "../utils/products.js";


export const createOrder = async (req, res)=>{
    const {product_id, quantity} = req.body;
    const user_id = req.user.id;

    try{
        const product = products.find(p => p.id === product_id);
        if(!product){
            return res.status(400).json({message: 'Invalid product id'});
        }
        const total_price = product.price * quantity;
        const orderId = await createOrderRecord({user_id, product_id, quantity, total_price});
        return res.status(201).json({message: 'Order created successfully', order: {id: orderId, user_id, product_id, quantity, total_price}});
    }catch(err){
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

export const getOrderById = async (req, res)=>{
    const orderId = req.params.id;
    try{
        const order = await findOrderById(orderId);
        if(!order){
            return res.status(404).json({message: 'Order not found'});
        }
        return res.status(200).json({order});
    }catch(err){
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

export const getOrdersByUserId = async (req, res)=>{
    const user_id = /* req?.user?.id || */ JSON.parse(req.headers['x-user'] || '{}')?.id

    if(!user_id) {
        console.log('User ID not found in request', userId);
        return res.status(401).json({message: 'Unauthorized'});
    }

    try{
        const orders = await findOrdersByUserId(user_id);
        return res.status(200).json({orders});
    }catch(err){
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}

//ideally this should be in a separate admin controller, but for simplicity, I'm keeping it here
export const getAllOrders = async (req, res)=>{
    const skip = parseInt(req.query.skip) || 0;
    try{
        const orders = await findAllOrders(skip);
        return res.status(200).json({orders});
    }catch(err){
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
    }
}
