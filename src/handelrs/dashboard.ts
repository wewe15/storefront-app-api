import express, { Request, Response } from 'express';
import { DashboardQueries } from '../services/dashboard';
import validateToken from '../middlewares/authentication';


const dashboard = new DashboardQueries()

const usersWithOrders = async (_req: Request, res: Response) => {
    const users = await dashboard.usersWithOrders()
    res.json(users)
}

const productsInOrders = async (_req: Request, res: Response) => {
  const products = await dashboard.productsInOrders()
  res.json(products)
}

const dashboardRoutes = (app: express.Application) => {
    app.get('/products_in_orders', validateToken, productsInOrders)
    app.get('/users-with-orders', validateToken, usersWithOrders)
}

export default dashboardRoutes;