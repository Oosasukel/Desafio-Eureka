import { Router } from 'express';
import AddressesRoutes from './addresses';

const routes = Router();

routes.use(AddressesRoutes);

export default routes;
