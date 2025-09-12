import { jest } from '@jest/globals';

const sendOTP = jest.fn().mockResolvedValue('1234');

export { sendOTP };
