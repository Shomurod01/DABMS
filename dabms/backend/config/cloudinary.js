const cloudinary    = require('cloudinary').v2;
const multer        = require('multer');
const { Readable }  = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = multer.memoryStorage();

const uploadProfile = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
  },
});

const uploadDocument = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only images and PDFs are allowed'), false);
  },
});


const uploadToCloudinary = (buffer, folder = 'dabms/profiles', options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        transformation: folder.includes('profile')
          ? [{ width: 500, height: 500, crop: 'fill', gravity: 'face' }]
          : [],
        ...options,
      },
      (err, result) => (err ? reject(err) : resolve(result))
    );

    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });

const fs = require('fs');
const path = require('path');


const cloudinaryUploadMiddleware =
  (folder = 'dabms/profiles') =>
  async (req, res, next) => {
    try {
      if (!req.file?.buffer) return next();

    
      const uploadDir = path.join(__dirname, '..', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${req.file.originalname.replace(/\\s+/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);

      fs.writeFileSync(filePath, req.file.buffer);

      req.file.path     = `http://localhost:5000/uploads/${fileName}`; 
      req.file.filename = fileName;
      
      next();
    } catch (err) {
      next(err);
    }
  };

module.exports = {
  cloudinary,
  uploadProfile,
  uploadDocument,
  uploadToCloudinary,
  cloudinaryUploadMiddleware,
};
