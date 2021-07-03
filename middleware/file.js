const multer = require('multer');
const { PUBLIC_BOOKS_PATH, ALLOWED_FILE_TYPES } = require('../const');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, PUBLIC_BOOKS_PATH);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
});
