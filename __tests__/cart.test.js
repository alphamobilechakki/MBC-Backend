import request from 'supertest';
import { app, server } from '../server.js';
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Cart from '../models/cartModel.js';
import jwt from 'jsonwebtoken';

describe('Cart API', () => {
  let token;
  let userId;
  let productId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const user = await User.create({ name: 'Test User', mobile: '1234567890' });
    userId = user._id;
    token = jwt.sign({ id: userId, role: 'user' }, process.env.TOKEN_SECRET_KEY, { expiresIn: '1d' });

    const product = await Product.create({ name: 'Test Product', price: 100, stock: 10 });
    productId = product._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await mongoose.connection.close();
    server.close();
  });

  it('should add an item to the cart', async () => {
    const res = await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 2 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].quantity).toBe(2);
  });

  it('should get the cart', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.items).toHaveLength(1);
  });

  it('should update an item in the cart', async () => {
    const cart = await Cart.findOne({ user: userId });
    const itemId = cart.items[0]._id;

    const res = await request(app)
      .put(`/api/cart/items/${itemId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.items[0].quantity).toBe(5);
  });

  it('should remove an item from the cart', async () => {
    const cart = await Cart.findOne({ user: userId });
    const itemId = cart.items[0]._id;

    const res = await request(app)
      .delete(`/api/cart/items/${itemId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.items).toHaveLength(0);
  });

  it('should clear the cart', async () => {
    await request(app)
      .post('/api/cart/items')
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 1 });

    const res = await request(app)
      .delete('/api/cart')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    const cart = await Cart.findOne({ user: userId });
    expect(cart.items).toHaveLength(0);
  });
});
