import request from 'supertest';
import { app, server } from '../server.js';
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Otp from '../models/OTPSchema.js';
import { jest } from '@jest/globals';

jest.unstable_mockModule('../controllers/user/otpController.js', () => ({
  __esModule: true,
  sendOTP: jest.fn().mockResolvedValue('1234'),
}));

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/testdb', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Otp.deleteMany({});
});

describe('Auth Workflow', () => {

  const TEST_USER_MOBILE = '1234567890';
  const TEST_USER_NAME = 'Test User';

  it('should return user not found for a new mobile number during login', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ mobile: TEST_USER_MOBILE });

    expect(res.statusCode).toEqual(404);
    expect(res.body.hasAccount).toBe(false);
    expect(res.body.message).toEqual('User not found, please sign up');
  });

  it('should send an OTP for a new user during signup', async () => {
    const res = await request(app)
      .post('/api/signup')
      .send({ mobile: TEST_USER_MOBILE, name: TEST_USER_NAME, address: { street: '123 Test St', city: 'Test City' } });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('OTP sent successfully!');
    
    const otpDoc = await Otp.findOne({ mobile: TEST_USER_MOBILE });
    expect(otpDoc).not.toBeNull();
    expect(otpDoc.otp).toBeDefined();
  });

  it('should successfully verify OTP and create a new user (signup)', async () => {
    const otp = '1234'; // Assuming 4-digit OTPs
    await Otp.create({ mobile: TEST_USER_MOBILE, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });

    const res = await request(app)
      .post('/api/verifyOTP')
      .send({ mobile: TEST_USER_MOBILE, otp, name: TEST_USER_NAME, address: { street: '123 Test St' } });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toEqual('User verified & logged in successfully!');
    expect(res.body.data.token).toBeDefined();

    const user = await User.findOne({ mobile: TEST_USER_MOBILE });
    expect(user).not.toBeNull();
    expect(user.name).toEqual(TEST_USER_NAME);
  });

  it('should send an OTP for an existing user during login', async () => {
    await User.create({ mobile: TEST_USER_MOBILE, name: TEST_USER_NAME });

    const res = await request(app)
      .post('/api/login')
      .send({ mobile: TEST_USER_MOBILE });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('OTP sent successfully');

    const otpDoc = await Otp.findOne({ mobile: TEST_USER_MOBILE });
    expect(otpDoc).not.toBeNull();
  });

  it('should successfully verify OTP and log in an existing user', async () => {
    const user = await User.create({ mobile: TEST_USER_MOBILE, name: TEST_USER_NAME });
    const otp = '5678';
    await Otp.create({ mobile: TEST_USER_MOBILE, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });

    const res = await request(app)
      .post('/api/verifyOTP')
      .send({ mobile: TEST_USER_MOBILE, otp });

    expect(res.statusCode).toEqual(201);
    expect(.body.success).toBe(true);
    expect(res.body.message).toEqual('User verified & logged in successfully!');
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user._id).toEqual(user._id.toString());
  });

  it('should fail OTP verification with an invalid OTP', async () => {
    await User.create({ mobile: TEST_USER_MOBILE, name: TEST_USER_NAME });
    const otp = '1111';
    await Otp.create({ mobile: TEST_USER_MOBILE, otp, expiresAt: new Date(Date.now() + 5 * 60 * 1000) });

    const res = await request(app)
      .post('/api/verifyOTP')
      .send({ mobile: TEST_USER_MOBILE, otp: '2222' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('Invalid OTP');
  });

  it('should fail OTP verification with an expired OTP', async () => {
    await User.create({ mobile: TEST_USER_MOBILE, name: TEST_USER_NAME });
    const otp = '1111';
    await Otp.create({ mobile: TEST_USER_MOBILE, otp, expiresAt: new Date(Date.now() - 1000) }); // Expired

    const res = await request(app)
      .post('/api/verifyOTP')
      .send({ mobile: TEST_USER_MOBILE, otp });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual('OTP expired. Please request a new one.');
  });

});
