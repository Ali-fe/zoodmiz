const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { BadRequestError } = require('../errors/customErrors');

const upload_path = path.join(__dirname, '../..', 'uploads');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { restaurantId } = req.user;
    const uploadPath = path.join(upload_path, restaurantId.toString());
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
      return cb(new BadRequestError('Invalid file format. Only JPEG, PNG and GIF images are allowed.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

// turns multer's own error objects into a 400 the client can show
const singleImageUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (!err) return next();
    const msg = err.code === 'LIMIT_FILE_SIZE'
      ? 'حجم تصویر نباید بیشتر از ۵ مگابایت باشد'
      : err.message || 'Image upload failed';
    next(new BadRequestError(msg));
  });
};

// Handle image upload
const handleImageUpload = (req) => {
  if (!req.file) {
    throw new BadRequestError('No file uploaded');
  }

  const { restaurantId } = req.user;
  const imageUrl = `/uploads/${restaurantId}/${req.file.filename}`;

  return {
    url: imageUrl,
    message: 'Image uploaded successfully'
  };
};
const getFileList = (req) => {
  const { restaurantId } = req.user;
  const dirPath = path.join(upload_path, restaurantId.toString());
  // a restaurant that never uploaded anything has no folder yet
  if (!fs.existsSync(dirPath)) return [];
  const filelist = fs.readdirSync(dirPath);
  const filesPath = filelist.map((filename) => {
    return { name: filename, url: `/uploads/${restaurantId}/${filename}` }
  });
  return filesPath;
}
const deleteFile = (req) => {
  const { restaurantId } = req.user;
  const res_uploadPath = path.join(upload_path, restaurantId.toString());
  const dirPath = path.join(res_uploadPath,path.basename(decodeURIComponent(req.url)));
  
  fs.rmSync(dirPath, {
    force: true,
  });
  return true;
}
module.exports = {
  singleImageUpload,
  handleImageUpload,
  getFileList,
  deleteFile
}; 