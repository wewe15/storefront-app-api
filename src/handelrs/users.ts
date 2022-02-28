import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User, UserModel } from '../models/users';
import validateToken from '../middlewares/authentication'

dotenv.config()
const store = new UserModel();
  

const index = async (_req: Request, res: Response) => {
    const users = await store.index();
    res.json(users);
}

const show = async (req: Request, res: Response) => {
   const user = await store.show(req.params.id);
   res.json(user);
}

const create = async (req: Request, res: Response) => {
    try {
        const user: User = {
            id: req.body.id,
            username: req.body.username,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            password: req.body.password,
        }

        const newUser = await store.create(user)
        res.json(newUser)
    } catch(err) {
        res.status(400);
        res.json(err);
    }
}

const authenticate = async (req: Request, res: Response) => {
    try {
       const username = req.body.username;
       const password = req.body.password;

       const user = await store.authenticate(username, password);
       const token = jwt.sign({user}, (process.env.JWT_SECRET as unknown) as string);
       if(!user){
           return res.status(401).json({status: 'error', message: 'the username or password do not match.'})
       }
       res.json({...user, token});
    } catch (err){
        res.status(400);
        res.json(err);
    }
}

const destroy = async (req: Request, res: Response) => {
    const deleted = await store.delete(req.params.id);
    res.json(deleted);
}

const userRoutes = (app: express.Application) => {
    app.get('/users', validateToken, index)
    app.get('/users/:id',validateToken, show)
    app.post('/users',  create)
    app.delete('/users/:id',validateToken, destroy)
    app.post('/users/authenticate', authenticate)
}

export default userRoutes;