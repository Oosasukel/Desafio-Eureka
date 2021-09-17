import { Router } from 'express';
import { AddressesController } from '../controllers';

const routes = Router();

const addressesController = new AddressesController();

routes.get('/addresses/:cep', addressesController.getByCEP);

export default routes;
