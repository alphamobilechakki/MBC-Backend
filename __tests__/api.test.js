const request = require('supertest');
const { app, server } = require('../server');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Category.deleteMany({});
});

describe('Auth API', () => {
  it('should send an OTP to a new user', async () => {
    const res = await request(app)
      .post('/api/auth/send-otp')
      .send({ phone: '1234567890' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('OTP sent successfully');
  });

  it('should verify the OTP and create a new user', async () => {
    const user = await User.create({ phone: '1234567890', otp: '1234' });

    const res = await request(app)
      .post('/api/auth/verify-otp')
      .send({ phone: '1234567890', otp: '1234' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.shouldCompleteProfile).toEqual(true);
    expect(res.body.token).toBeDefined();
  });

  it('should complete the user profile', async () => {
    const user = await User.create({ phone: '1234567890', otp: '1234', isVerified: true });
    const token = require('../utils/generateToken')(user._id);

    const res = await request(app)
      .post('/api/auth/complete-profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test User',
        address: '123 Test St',
        state: 'Test State',
        city: 'Test City',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('Test User');
  });
});

describe('Product API', () => {
  let token;
  let categoryId;

  beforeEach(async () => {
    const adminUser = await User.create({ phone: '1234567890', role: 'admin', isVerified: true, name: 'Admin User' });
    token = require('../utils/generateToken')(adminUser._id);
    const category = await Category.create({ name: 'Test Category' });
    categoryId = category._id;
  });

  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        category: categoryId,
        stock: 10,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toEqual('Test Product');
  });
});

describe('Category API', () => {
  let token;

  beforeEach(async () => {
    const adminUser = await User.create({ phone: '0987654321', role: 'admin', isVerified: true, name: 'Admin User' });
    token = require('../utils/generateToken')(adminUser._id);
  });

  it('should create a new category', async () => {
    const res = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Category' });

    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toEqual('New Category');
  });
});
