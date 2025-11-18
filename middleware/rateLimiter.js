import rateLimit from 'express-rate-limit';

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many requests from this IP, please try again after 5 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

export { otpLimiter };
