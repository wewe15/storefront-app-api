import express, { Request, Response } from 'express';
import { DashboardQueries } from '../services/dashboard';
import validateToken from '../middlewares/authentication';


const dashboard = new DashboardQueries()

const usersWithOrders = async (_req: Request, res: Response) => {
  try{
    const users = await dashboard.usersWithOrders()
    res.json(users)
  } catch (err){
    res.status(400).json(err);
  }
    
}

const productsInOrders = async (_req: Request, res: Response) => {
  try{
    const products = await dashboard.productsInOrders()
    res.json(products)
  } catch (err){
    res.status(400).json(err);
  }
  
}

const dashboardRoutes = (app: express.Application) => {
    app.get('/products_in_orders', validateToken, productsInOrders)
    app.get('/users-with-orders', validateToken, usersWithOrders)
}

export default dashboardRoutes;