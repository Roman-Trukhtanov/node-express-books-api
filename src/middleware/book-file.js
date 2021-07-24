const multer = require('multer');
const {
  PUBLIC_BOOKS_PATH,
  PUBLIC_COVERS_PATH,
  ALLOWED_FILE_TYPES,
  ALLOWED_IMG_TYPES,
} = require('../../const');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      cb(null, PUBLIC_BOOKS_PATH);
    }

    if (ALLOWED_IMG_TYPES.includes(file.mimetype)) {
      cb(null, PUBLIC_COVERS_PATH);
    }
  },
  filename(req, file, cb) {
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    ALLOWED_FILE_TYPES.includes(file.mimetype) ||
    ALLOWED_IMG_TYPES.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
});
