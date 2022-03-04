import express, {Request, Response} from "express";
import { Product, ProductModel } from "../models/products";
import validateToken from '../middlewares/authentication'


const store = new ProductModel();

const index = async (_req: Request, res: Response) => {
    try{
        const products = await store.index()
        res.json(products)
    } catch (err){
        res.status(400).json(err);
    }
    
}

const show = async (req: Request, res: Response) => {
    try{
        const product = await store.show(req.params.id)
        res.json(product)
    } catch (err){
        res.status(400).json(err)
    }
    
}

const create = async (req: Request, res: Response) => {
    try{
        const product: Product = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price
        }
        const newProduct = await store.create(product)
        res.json(newProduct)
    } catch (err) {
        res.status(400);
        res.json(err);
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

const productRoutes = (app: express.Application) => {
    app.get('/products',validateToken, index)
    app.get('/products/:id',validateToken, show)
    app.post('/products',validateToken ,create)
    app.delete('/products/:id', validateToken, destroy)
}

export default productRoutes;