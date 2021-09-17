import cors from 'cors';
import express from 'express';
import { appError } from 'middlewares';
import routes from 'routes';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', routes);

app.use(appError());

export default app;
