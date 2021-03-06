import express, {Request, Response} from "express";
import { Order, OrderProduct ,OrderModel } from "../models/orders";
import validateToken from '../middlewares/authentication';


const store = new OrderModel();

const index = async (_req: Request, res: Response) => {
    try{
        const orders = await store.index()
        res.json(orders)
    } catch (err){
        res.status(400).json(err)
    }
    
}

const show = async (req: Request, res: Response) => {
    try{
        const order = await store.show(req.params.id)
        res.json(order)
    } catch (err){
        res.status(400).json(err);
    }
    
}

const create = async (req: Request, res: Response) => {
    try {
        const order: Order = {
            id: req.body.id,
            user_id: req.body.user_id,
            status: req.body.status,
        }
        const newOrder = await store.create(order)
        res.json(newOrder)
    } catch (err) {
        res.status(400).json(err);
    }
}

const addProduct = async (req: Request, res: Response) => {
    try{
        const orderProduct : OrderProduct = {
            id: req.body.id,
            order_id: req.params.id,
            product_id: req.body.product_id,
            quantity: parseInt(req.body.quantity)
        }
        const newAddedProduct = await store.addProduct(orderProduct)
        res.json(newAddedProduct)
    } catch (err) {
        res.status(400).json(err);
    }
}

const destroy = async (req: Request, res: Response) => {
    try{
        const deleted = await store.delete(req.params.id)
        res.json(deleted)
    } catch (err){
        res.status(400).json(err);
    }
    
}

const OrderRoutes = (app: express.Application) => {
    app.get('/orders',validateToken, index)
    app.get('/orders/:id',validateToken, show)
    app.post('/orders',validateToken ,create)
    app.post('/orders/:id/products', validateToken, addProduct)
    app.delete('/orders/:id', validateToken, destroy)
}

export default OrderRoutes;