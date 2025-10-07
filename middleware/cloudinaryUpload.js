import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const cloudinaryUpload = (req, res, next) => {
  if (!req.file) {
    return next(); // No file uploaded, proceed to next middleware
  }

  const stream = cloudinary.uploader.upload_stream(
    { folder: 'your_folder_name' }, // Optional: specify a folder in Cloudinary
    (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Cloudinary upload failed', error: error });
      }
      req.body.imageUrl = result.secure_url;
      next();
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
};

export default cloudinaryUpload;
