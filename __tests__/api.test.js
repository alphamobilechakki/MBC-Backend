import request from 'supertest';
import { app, server } from '../server.js';
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import Review from '../models/reviewModel.js';
import Admin from '../models/adminModel.js';
import Driver from '../models/driverModel.js';
import Otp from '../models/OTPSchema.js';
import Category from '../models/categoryModel.js';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  await Review.deleteMany({});
  await Admin.deleteMany({});
  await Driver.deleteMany({});
  await Otp.deleteMany({});
  await Category.deleteMany({});
});

describe('User Authentication', () => {
  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send({
        name: 'Test User',
        mobile: '1234567890',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
        }
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('OTP sent successfully!');
  });

  it('should send an OTP to a mobile number', async () => {
    const res = await request(app)
      .post('/api/sendOTP')
      .send({ mobile: '1234567890' });
    expect(res.statusCode).toEqual(200);
  });

  it('should verify the OTP', async () => {
    const otp = '123456';
    await Otp.create({ mobile: '1234567890', otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
    const res = await request(app)
      .post('/api/verifyOTP')
      .send({ mobile: '1234567890', otp, name: 'Test User' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  it('should log in a user', async () => {
    await User.create({ name: 'Test User', mobile: '1234567890' });
    const res = await request(app)
      .post('/api/login')
      .send({ mobile: '1234567890' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Product API', () => {
  let token;
  let categoryId;

  beforeEach(async () => {
    const user = await User.create({ name: 'Test User', mobile: '1234567890', role: 'admin' });
    const res = await request(app)
      .post('/api/login')
      .send({ mobile: '1234567890' });
    token = res.body.token;
    const category = await Category.create({ name: 'Test Category' });
    categoryId = category._id;
  });

  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product',
        description: 'Test Description',
        purchasePrice: 80,
        price: 120,
        sellingPrice: 100,
        stock: 10,
        category: categoryId,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toEqual('Test Product');
  });

  it('should get all products', async () => {
    await Product.create({ name: 'Test Product 1', description: 'Test Description', purchasePrice: 80, price: 120, sellingPrice: 100, stock: 10, category: categoryId });
    await Product.create({ name: 'Test Product 2', description: 'Test Description', purchasePrice: 80, price: 120, sellingPrice: 100, stock: 10, category: categoryId });

    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.products.length).toEqual(2);
  });

  it('should get a single product by id', async () => {
    const product = await Product.create({ name: 'Test Product', description: 'Test Description', purchasePrice: 80, price: 120, sellingPrice: 100, stock: 10, category: categoryId });

    const res = await request(app).get(`/api/products/${product._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toEqual('Test Product');
  });

  it('should update a product', async () => {
    const product = await Product.create({ name: 'Test Product', description: 'Test Description', purchasePrice: 80, price: 120, sellingPrice: 100, stock: 10, category: categoryId });

    const res = await request(app)
      .put(`/api/admin/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Test Product' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toEqual('Updated Test Product');
  });

  it('should delete a product', async () => {
    const product = await Product.create({ name: 'Test Product', description: 'Test Description', purchasePrice: 80, price: 120, sellingPrice: 100, stock: 10, category: categoryId });

    const res = await request(app)
      .delete(`/api/admin/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('Product deleted successfully');
  });
});

describe('Review API', () => {
  let token;
  let productId;
  let categoryId;

  beforeEach(async () => {
    const user = await User.create({ name: 'Test User', mobile: '1234567890' });
    const res = await request(app)
      .post('/api/login')
      .send({ mobile: '1234567890' });
    token = res.body.token;
    const category = await Category.create({ name: 'Test Category' });
    categoryId = category._id;
    const product = await Product.create({ name: 'Test Product', description: 'Test Description', purchasePrice: 80, price: 120, sellingPrice: 100, stock: 10, category: categoryId });
    productId = product._id;
  });

  it('should create a new review for a product', async () => {
    const res = await request(app)
      .post(`/api/reviews/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        rating: 5,
        comment: 'Great product!',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.comment).toEqual('Great product!');
  });

  it('should get all reviews for a product', async () => {
    await Review.create({ product: productId, user: (await User.findOne({}))._id, rating: 4, comment: 'Good product' });
    await Review.create({ product: productId, user: (await User.findOne({}))._id, rating: 5, comment: 'Excellent product' });

    const res = await request(app).get(`/api/reviews/${productId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toEqual(2);
  });
});

describe('Order API', () => {
  let userToken;
  let adminToken;
  let userId;
  let productId;
  let categoryId;

  beforeEach(async () => {
    const user = await User.create({ name: 'Test User', mobile: '1234567890' });
    userId = user._id;
    const userLoginRes = await request(app)
      .post('/api/login')
      .send({ mobile: '1234567890' });
    userToken = userLoginRes.body.token;

    const admin = await Admin.create({ name: 'Test Admin', mobile: '0987654321', password: 'password123', role: 'admin' });
    const adminLoginRes = await request(app)
      .post('/api/admin/login')
      .send({ mobile: '0987654321', password: 'password123' });
    adminToken = adminLoginRes.body.token;

    const category = await Category.create({ name: 'Test Category' });
    categoryId = category._id;
    const product = await Product.create({ name: 'Test Product', description: 'Test Description', purchasePrice: 80, price: 120, sellingPrice: 100, stock: 10, category: categoryId });
    productId = product._id;
  });

  it('should create a new order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        orderItems: [
          {
            product: productId,
            name: 'Test Product',
            quantity: 1,
            price: 100,
            image: 'test.jpg',
          },
        ],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
        },
        paymentMethod: 'COD',
        itemsPrice: 100,
        taxPrice: 10,
        shippingPrice: 5,
        totalPrice: 115,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toEqual(userId.toString());
  });

  it('should get all orders for a user', async () => {
    await Order.create({
      user: userId,
      orderItems: [
        {
          product: productId,
          name: 'Test Product',
          quantity: 1,
          price: 100,
          image: 'test.jpg',
        },
      ],
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
      },
      paymentMethod: 'COD',
      itemsPrice: 100,
      taxPrice: 10,
      shippingPrice: 5,
      totalPrice: 115,
    });

    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toEqual(1);
  });

  it('should get a single order by id', async () => {
    const order = await Order.create({
      user: userId,
      orderItems: [
        {
          product: productId,
          name: 'Test Product',
          quantity: 1,
          price: 100,
          image: 'test.jpg',
        },
      ],
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
      },
      paymentMethod: 'COD',
      itemsPrice: 100,
      taxPrice: 10,
      shippingPrice: 5,
      totalPrice: 115,
    });

    const res = await request(app)
      .get(`/api/orders/${order._id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toEqual(order._id.toString());
  });

  it('should update order status (admin only)', async () => {
    const order = await Order.create({
      user: userId,
      orderItems: [
        {
          product: productId,
          name: 'Test Product',
          quantity: 1,
          price: 100,
          image: 'test.jpg',
        },
      ],
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
      },
      paymentMethod: 'COD',
      itemsPrice: 100,
      taxPrice: 10,
      shippingPrice: 5,
      totalPrice: 115,
    });

    const res = await request(app)
      .put(`/api/admin/orders/${order._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Shipped' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderStatus).toEqual('Shipped');
  });
});

describe('Admin API', () => {
  let adminToken;

  beforeEach(async () => {
    const admin = await Admin.create({ name: 'Test Admin', mobile: '0987654321', password: 'password123', role: 'admin' });
    const res = await request(app)
      .post('/api/admin/login')
      .send({ mobile: '0987654321', password: 'password123' });
    adminToken = res.body.token;
  });

  it('should allow admin to login', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ mobile: '0987654321', password: 'password123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });

  it('should create a new driver', async () => {
    const res = await request(app)
      .post('/api/admin/drivers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Driver',
        mobile: '1122334455',
        licenseNumber: 'DL12345',
        vehicleNumber: 'KA01AB1234',
        password: 'driverpass',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toEqual('Test Driver');
  });

  it('should get all drivers', async () => {
    await Driver.create({ name: 'Test Driver 1', mobile: '1111111111', licenseNumber: 'DL111', vehicleNumber: 'KA01AA1111', createdBy: (await Admin.findOne({}))._id });
    await Driver.create({ name: 'Test Driver 2', mobile: '2222222222', licenseNumber: 'DL222', vehicleNumber: 'KA01BB2222', createdBy: (await Admin.findOne({}))._id });

    const res = await request(app)
      .get('/api/admin/drivers')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toEqual(2);
  });
});

describe('User Profile API', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const user = await User.create({ name: 'Test User', mobile: '1234567890', addresses: [{ street: '123 Test St', city: 'Test City', state: 'Test State', zipCode: '12345' }] });
    userId = user._id;
    const res = await request(app)
      .post('/api/login')
      .send({ mobile: '1234567890' });
    token = res.body.token;
  });

  it('should get user profile', async () => {
    const res = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('Test User');
    expect(res.body._id).toEqual(userId.toString());
  });

  it('should update user profile', async () => {
    const res = await request(app)
      .put('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated User',
        address: {
          street: '456 New St',
          city: 'New City',
          state: 'New State',
          zipCode: '67890',
        },
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('Updated User');
    expect(res.body.addresses.length).toEqual(2);
  });
});


beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  await Review.deleteMany({});
  await Admin.deleteMany({});
  await Driver.deleteMany({});
  await Otp.deleteMany({});
});

describe('User Authentication', () => {
  it('should sign up a new user', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send({
        name: 'Test User',
        mobile: '1234567890',
        address: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
        }
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('OTP sent successfully!');
  });

  it('should send an OTP to a mobile number', async () => {
    const res = await request(app)
      .post('/api/sendOTP')
      .send({ mobile: '1234567890' });
    expect(res.statusCode).toEqual(200);
  });

  it('should verify the OTP', async () => {
    const otp = '123456';
    await Otp.create({ mobile: '1234567890', otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
    const res = await request(app)
      .post('/api/verifyOTP')
      .send({ mobile: '1234567890', otp, name: 'Test User' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });

  it('should log in a user', async () => {
    await User.create({ name: 'Test User', mobile: '1234567890' });
    const res = await request(app)
      .post('/api/login')
      .send({ mobile: '1234567890' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });
});

describe('Product API', () => {
  let token;

  beforeEach(async () => {
    const user = await User.create({ name: 'Test User', mobile: '1234567890', role: 'admin' });
    const res = await request(app)
      .post('/api/login')
      .send({ mobile: '1234567890' });
    token = res.body.data;
  });

  it('should create a new product', async () => {
    const res = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Product',
        description: 'Test Description',
        purchasePrice: 80,
        price: 120,
        sellingPrice: 100,
        stock: 10,
        category: 'Test Category',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toEqual('Test Product');
  });

  it('should get all products', async () => {
    await Product.create({ name: 'Test Product 1', description: 'Test Description', purchasePrice: 80, price: 120, sellingPrice: 100, stock: 10, category: 'Test Category' });
    await Product.create({ name: 'Test Product 2', description: 'Test Description', purchasePrice: 80, price: 120, sellingPrice: 100, stock: 10, category: 'Test Category' });

    const res = await request(app).get('/api/products');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.products.length).toEqual(2);
  });

  it('should get a single product by id', async () => {
    const product = await Product.create({ name: 'Test Product', description: 'Test Description', purchasePrice: 80, price: 120, sellingPrice: 100, stock: 10, category: 'Test Category' });

    const res = await request(app).get(`/api/products/${product._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toEqual('Test Product');
  });

  it('should update a product', async () => {
    const product = await Product.create({ name: 'Test Product', description: 'Test Description', purchasePrice: 80, price: 120, sellingPrice: 100, stock: 10, category: 'Test Category' });

    const res = await request(app)
      .put(`/api/admin/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Test Product' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toEqual('Updated Test Product');
  });

  it('should delete a product', async () => {
    const product = await Product.create({ name: 'Test Product', description: 'Test Description', purchasePrice: 80, price: 120, sellingPrice: 100, stock: 10, category: 'Test Category' });

    const res = await request(app)
      .delete(`/api/admin/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('Product deleted successfully');
  });
});

describe('Review API', () => {
  let token;
  let productId;

  beforeEach(async () => {
    const user = await User.create({ name: 'Test User', mobile: '1234567890' });
    const res = await request(app)
      .post('/api/login')
      .send({ mobile: '1234567890' });
    token = res.body.data;
    const product = await Product.create({ name: 'Test Product', description: 'Test Description', purchasePrice: 80, price: 120, sellingPrice: 100, stock: 10, category: 'Test Category' });
    productId = product._id;
  });

  it('should create a new review for a product', async () => {
    const res = await request(app)
      .post(`/api/reviews/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        rating: 5,
        comment: 'Great product!',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.comment).toEqual('Great product!');
  });

  it('should get all reviews for a product', async () => {
    await Review.create({ product: productId, user: (await User.findOne({}))._id, rating: 4, comment: 'Good product' });
    await Review.create({ product: productId, user: (await User.findOne({}))._id, rating: 5, comment: 'Excellent product' });

    const res = await request(app).get(`/api/reviews/${productId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toEqual(2);
  });
});

describe('Order API', () => {
  let userToken;
  let adminToken;
  let userId;
  let productId;

  beforeEach(async () => {
    const user = await User.create({ name: 'Test User', mobile: '1234567890' });
    userId = user._id;
    const userLoginRes = await request(app)
      .post('/api/login')
      .send({ mobile: '1234567890' });
    userToken = userLoginRes.body.data;

    const admin = await Admin.create({ name: 'Test Admin', mobile: '0987654321', password: 'password123', role: 'admin' });
    const adminLoginRes = await request(app)
      .post('/api/admin/login')
      .send({ mobile: '0987654321', password: 'password123' });
    adminToken = adminLoginRes.body.token;

    const product = await Product.create({ name: 'Test Product', description: 'Test Description', purchasePrice: 80, price: 120, sellingPrice: 100, stock: 10, category: 'Test Category' });
    productId = product._id;
  });

  it('should create a new order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        orderItems: [
          {
            product: productId,
            name: 'Test Product',
            quantity: 1,
            price: 100,
            image: 'test.jpg',
          },
        ],
        shippingAddress: {
          street: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          zipCode: '12345',
        },
        paymentMethod: 'COD',
        itemsPrice: 100,
        taxPrice: 10,
        shippingPrice: 5,
        totalPrice: 115,
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user).toEqual(userId.toString());
  });

  it('should get all orders for a user', async () => {
    await Order.create({
      user: userId,
      orderItems: [
        {
          product: productId,
          name: 'Test Product',
          quantity: 1,
          price: 100,
          image: 'test.jpg',
        },
      ],
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
      },
      paymentMethod: 'COD',
      itemsPrice: 100,
      taxPrice: 10,
      shippingPrice: 5,
      totalPrice: 115,
    });

    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toEqual(1);
  });

  it('should get a single order by id', async () => {
    const order = await Order.create({
      user: userId,
      orderItems: [
        {
          product: productId,
          name: 'Test Product',
          quantity: 1,
          price: 100,
          image: 'test.jpg',
        },
      ],
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
      },
      paymentMethod: 'COD',
      itemsPrice: 100,
      taxPrice: 10,
      shippingPrice: 5,
      totalPrice: 115,
    });

    const res = await request(app)
      .get(`/api/orders/${order._id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toEqual(order._id.toString());
  });

  it('should update order status (admin only)', async () => {
    const order = await Order.create({
      user: userId,
      orderItems: [
        {
          product: productId,
          name: 'Test Product',
          quantity: 1,
          price: 100,
          image: 'test.jpg',
        },
      ],
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
      },
      paymentMethod: 'COD',
      itemsPrice: 100,
      taxPrice: 10,
      shippingPrice: 5,
      totalPrice: 115,
    });

    const res = await request(app)
      .put(`/api/admin/orders/${order._id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Shipped' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.orderStatus).toEqual('Shipped');
  });
});

describe('Admin API', () => {
  let adminToken;

  beforeEach(async () => {
    const admin = await Admin.create({ name: 'Test Admin', mobile: '0987654321', password: 'password123', role: 'admin' });
    const res = await request(app)
      .post('/api/admin/login')
      .send({ mobile: '0987654321', password: 'password123' });
    adminToken = res.body.token;
  });

  it('should allow admin to login', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ mobile: '0987654321', password: 'password123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
  });

  it('should create a new driver', async () => {
    const res = await request(app)
      .post('/api/admin/drivers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Driver',
        mobile: '1122334455',
        licenseNumber: 'DL12345',
        vehicleNumber: 'KA01AB1234',
        password: 'driverpass',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toEqual('Test Driver');
  });

  it('should get all drivers', async () => {
    await Driver.create({ name: 'Test Driver 1', mobile: '1111111111', licenseNumber: 'DL111', vehicleNumber: 'KA01AA1111', createdBy: (await Admin.findOne({}))._id });
    await Driver.create({ name: 'Test Driver 2', mobile: '2222222222', licenseNumber: 'DL222', vehicleNumber: 'KA01BB2222', createdBy: (await Admin.findOne({}))._id });

    const res = await request(app)
      .get('/api/admin/drivers')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toEqual(2);
  });
});

describe('User Profile API', () => {
  let token;
  let userId;

  beforeEach(async () => {
    const user = await User.create({ name: 'Test User', mobile: '1234567890', addresses: [{ street: '123 Test St', city: 'Test City', state: 'Test State', zipCode: '12345' }] });
    userId = user._id;
    const res = await request(app)
      .post('/api/login')
      .send({ mobile: '1234567890' });
    token = res.body.data;
  });

  it('should get user profile', async () => {
    const res = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('Test User');
    expect(res.body._id).toEqual(userId.toString());
  });

  it('should update user profile', async () => {
    const res = await request(app)
      .put('/api/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Updated User',
        address: {
          street: '456 New St',
          city: 'New City',
          state: 'New State',
          zipCode: '67890',
        },
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('Updated User');
    expect(res.body.addresses.length).toEqual(2);
  });
});