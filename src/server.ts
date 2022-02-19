import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './handelrs/users';
import productRoutes from './handelrs/products';
import handleErrors from './middlewares/error';

const app: express.Application = express();
const address: string = "0.0.0.0:3000";

app.use(bodyParser.json());
app.use(handleErrors)

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!');
});
userRoutes(app);
productRoutes(app);

app.use((_req: Request, res: Response) => {
    res.status(404).json({message: 'oh you are lost.'})
})


app.listen(3000, function () {
    console.log(`starting app on: ${address}`);
})
