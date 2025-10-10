import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const cloudinaryUploadMultiple = (req, res, next) => {
  upload.array('images', 5)(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Image upload failed', error: err });
    }

    if (!req.files || req.files.length === 0) {
      return next(); // No files uploaded, proceed to next middleware
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'products' }, // Optional: specify a folder in Cloudinary
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );
        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    try {
      const imageUrls = await Promise.all(uploadPromises);
      req.body.images = imageUrls;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Cloudinary upload failed', error: error });
    }
  });
};

export default cloudinaryUploadMultiple;
