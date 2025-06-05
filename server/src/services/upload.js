const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload_path = process.env.UPLOAD_PATH;

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { restaurantId } = req.user;
    const uploadPath = path.join(__dirname, '../..', 'uploads', restaurantId.toString());
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure upload middleware
const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file format. Only JPEG, PNG and GIF images are allowed.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// Handle image upload
const handleImageUpload = (req) => {
  if (!req.file) {
    throw new Error('No file uploaded');
  }

  const { restaurantId } = req.user;
  const imageUrl = `/uploads/${restaurantId}/${req.file.filename}`;
  
  return {
    url: imageUrl,
    message: 'Image uploaded successfully'
  };
};

module.exports = {
  upload,
  handleImageUpload
}; 