import { AppError } from 'errors/AppError';
import { NextFunction, Request, Response } from 'express';
import { getAddressByCEP } from 'services';

export class AddressesController {
  async getByCEP(request: Request, response: Response, next: NextFunction) {
    const {
      params: { cep },
    } = request;

    try {
      const address = await getAddressByCEP(cep);

      if (address.erro) {
        return next(new AppError(`CEP ${cep} does not exists.`, 404));
      }

      return response.json(address);
    } catch (error) {
      return next(error);
    }
  }
}

export default AddressesController;
