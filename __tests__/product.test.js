import request from 'supertest';
import { app, server } from '../server.js';
import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';

jest.unstable_mockModule('../models/productModel.js', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
    prototype: {
      save: jest.fn(),
    },
  },
}));

const Product = (await import('../models/productModel.js')).default;

let token;

afterAll((done) => {
  server.close(done);
});

beforeAll(() => {
  token = jwt.sign({ _id: 'admin_id', role: 'admin' }, process.env.TOKEN_SECRET_KEY);
});

describe('Product API', () => {
  it('should get all products', async () => {
    const mockProducts = [
      { name: 'Product 1', price: 10 },
      { name: 'Product 2', price: 20 },
    ];
    Product.find.mockResolvedValue({
      limit: () => ({
        skip: () => ({
          exec: () => mockProducts,
        }),
      }),
    });
    Product.countDocuments.mockResolvedValue(2);

    const res = await request(app).get('/api/products');

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.products.length).toBe(2);
  });

  it('should get a single product by id', async () => {
    const mockProduct = { name: 'Product 1', price: 10 };
    Product.findById.mockResolvedValue(mockProduct);

    const res = await request(app).get('/api/products/123');

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Product 1');
  });

  it('should create a new product', async () => {
    const mockProduct = { name: 'Product 1', price: 10 };
    Product.prototype.save.mockResolvedValue(mockProduct);

    const res = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${token}`)
      .send(mockProduct);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Product 1');
  });

  it('should update a product', async () => {
    const mockProduct = { name: 'Product 1 updated', price: 10 };
    Product.findByIdAndUpdate.mockResolvedValue(mockProduct);

    const res = await request(app)
      .put('/api/admin/products/123')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Product 1 updated' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Product 1 updated');
  });

  it('should delete a product', async () => {
    const mockProduct = { name: 'Product 1', price: 10 };
    Product.findByIdAndDelete.mockResolvedValue(mockProduct);

    const res = await request(app)
      .delete('/api/admin/products/123')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Product deleted successfully');
  });

  it('should search for products', async () => {
    const mockProducts = [
      { name: 'Product 1', price: 10 },
      { name: 'Product 2', price: 20 },
    ];
    Product.find.mockResolvedValue(mockProducts);

    const res = await request(app).get('/api/products/search?q=Product');

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBe(2);
  });
});
