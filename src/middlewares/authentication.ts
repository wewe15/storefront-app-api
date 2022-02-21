import {Request, Response, NextFunction} from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config()


const validateToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = (req.headers.authorization as unknown) as string;
        const token = authorizationHeader.split(' ')[1];
        if (token){
            const decode = jwt.verify(token, (process.env.JWT_SECRET as unknown) as string);
            if (decode){
                next()
            } else {
                res.status(401);
                res.send('login Erorr: please try again');
            } 
        } else {
            res.status(401);
            res.send('login Erorr: please try again');
        }
        
    } catch (err) {
        res.status(401);
        res.send('login Erorr: please try again');;
    }
    
}

export default validateToken;
