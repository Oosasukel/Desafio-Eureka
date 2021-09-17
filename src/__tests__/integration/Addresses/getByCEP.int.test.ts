import app from 'app';
import axios from 'axios';
import redis from 'database/redis';
import request from 'supertest';
import { Address } from 'types';

jest.mock('database/redis');
jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedRedis = redis as jest.Mocked<typeof redis>;

const mockedAddress: Address = {
  cep: '18195-000',
  logradouro: '',
  complemento: '',
  bairro: '',
  localidade: 'Capela do Alto',
  uf: 'SP',
  ibge: '3510302',
  gia: '2525',
  ddd: '15',
  siafi: '6307',
};

describe('Endpoint GET Address', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be possible to get an address by CEP', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockedAddress });

    const response = await request(app).get('/api/addresses/18195000');

    expect(response.body.localidade).toBe(mockedAddress.localidade);
    expect(response.status).toBe(200);
    expect(redis.get).toBeCalled();
    expect(axios.get).toBeCalled();
    expect(redis.set).toBeCalled();
  });

  it('should not call api if the data is already cached', async () => {
    mockedRedis.get.mockResolvedValueOnce(JSON.stringify(mockedAddress));

    const response = await request(app).get('/api/addresses/18195000');

    expect(response.body.localidade).toBe(mockedAddress.localidade);
    expect(response.status).toBe(200);
    expect(redis.get).toBeCalled();
    expect(axios.get).not.toBeCalled();
  });

  it('should return not found if the CEP does not exists', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { erro: true } });

    const response = await request(app).get('/api/addresses/18195000');

    expect(response.body.message).toBe('CEP 18195000 does not exists.');
    expect(response.status).toBe(404);
  });

  it('should return bad request if the CEP is invalid', async () => {
    const response = await request(app).get('/api/addresses/bananas123');

    expect(response.body.message).toBe('Invalid CEP');
    expect(response.status).toBe(400);
  });

  it('should return internal server error if the api return error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Some error ocurred'));

    const response = await request(app).get('/api/addresses/18195000');

    expect(response.body.message).toBe('Some error ocurred');
    expect(response.status).toBe(500);
  });
});
