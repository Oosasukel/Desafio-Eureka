import axios from 'axios';
import { AppError } from 'errors/AppError';
import { Address } from 'types';
import CacheService from '../CacheService';

export const getAddressByCEP = async (CEP: string): Promise<Address> => {
  return validateCEP(CEP).then(getCachedOrFetchAddress);
};

const validateCEP = (CEP: string) => {
  const valid = new RegExp(/\d{8}/).test(CEP);

  return valid
    ? Promise.resolve(CEP)
    : Promise.reject(new AppError('Invalid CEP'));
};

const getCachedOrFetchAddress = async (CEP: string) => {
  const address = await new CacheService<Address>().get(CEP, () =>
    fetchAddressByCEP(CEP)
  );

  return address;
};

const fetchAddressByCEP = async (CEP: string) => {
  const response = await axios.get<Address>(
    `https://viacep.com.br/ws/${CEP}/json/`
  );

  return response.data;
};
