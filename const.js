const REQUEST_TIMEOUT = 1000 * 120;

const PUBLIC_BOOKS_PATH = 'public/books';
const PUBLIC_COVERS_PATH = 'public/covers';
const ALLOWED_IMG_TYPES = ['image/png', 'image/jpg', 'image/jpeg'];
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/epub+zip',
  'application/fb2',
  'application/octet-stream',
];

module.exports = {
  REQUEST_TIMEOUT,
  PUBLIC_BOOKS_PATH,
  PUBLIC_COVERS_PATH,
  ALLOWED_IMG_TYPES,
  ALLOWED_FILE_TYPES,
};
