const express = require('express');
const router = express.Router();
const { Book } = require('../../models');
const fileMiddleware = require('../../middleware/book-file');
const counterApi = require('../../core/counter-api');

router.get('/', async (req, res) => {
  const books = await Book.find().select('-__v');
  res.json(books);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  let book;
  let counterData;

  try {
    book = await Book.findOne({ id }).select('-__v');
  } catch (err) {
    console.error(err);
  }

  if (!book) {
    res.status(404);
    res.json('Book | not found');
    return;
  }

  try {
    counterData = await counterApi.post(id);
  } catch (err) {
    console.error(err);
    res.status(500);
    res.json(err);
    return;
  }

  res.json({ book, counter: counterData.counter });
});

router.post('/', async (req, res) => {
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  } = req.body;

  // CREATE NEW_BOOK
  const newBook = new Book({
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  });

  // SAVE NEW_BOOK
  try {
    await newBook.save();

    res.status(201);
    res.json(newBook);
  } catch (e) {
    console.error(e);
    res.status(500);
    res.json('Book validation errors');
  }
});

router.put('/:id', async (req, res) => {
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  } = req.body;
  const { id } = req.params;
  let book;

   try {
     book = await Book.findOne({ id });
   } catch (e) {
     console.error(e);
   }

   if (!book) {
     res.status(404);
     res.json('Book | not found');
     return;
   }

  try {
    book = Object.assign(book, {
      title,
      description,
      authors,
      favorite,
      fileCover,
      fileName,
      fileBook,
    });
    await book.save();
  } catch (e) {
    console.error(e);
  }

  res.json(book);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Book.findOneAndDelete({ id });
  } catch (err) {
    console.error(err);
    res.status(404);
    res.json('Book | not found');
    return;
  }

  res.json(true);
});

router.post('/upload', fileMiddleware.single('book_file'), (req, res) => {
  if (req.file) {
    const { path } = req.file;

    res.json(path);
  } else {
    res.json(null);
  }
});

router.get('/:id/download', async (req, res) => {
  const { id } = req.params;
  let book;

  try {
    book = await Book.findOne({ id });
  } catch (err) {
    console.error(err);
  }

  if (!book) {
    res.status(404);
    res.json('Book file | not found');
    return;
  }

  res.download(__dirname + `/../../../${book.fileBook}`, book.fileName, (err) => {
    if (err) {
      console.error(err);
      res.status(404).json({err});
    }
  });
});

module.exports = router;
