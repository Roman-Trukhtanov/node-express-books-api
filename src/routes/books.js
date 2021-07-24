const express = require('express');
const router = express.Router();
const { Book } = require('../models');
const fileMiddleware = require('../middleware/book-file');
const counterApi = require('../core/counter-api');

const bookFiles = [
  { name: 'fileCover', maxCount: 1 },
  { name: 'fileBook', maxCount: 1 },
];

router.get('/', async (req, res) => {
  const books = await Book.find().select('-__v');

  res.render('books/index', {
    title: 'Books',
    books: books,
  });
});

router.get('/create', (req, res) => {
  res.render('books/create', {
    title: 'Book | create',
    book: {},
  });
});

router.post('/create', fileMiddleware.fields(bookFiles), async (req, res) => {
  const { title, description, authors, favorite } = req.body;

  const fileCover = req?.files?.fileCover;
  const fileBook = req?.files?.fileBook;

  const fileCoverPath = fileCover ? fileCover[0]?.path : '';
  const fileBookPath = fileBook ? fileBook[0]?.path : '';
  const fileName = fileBook ? fileBook[0]?.originalname : '';

  // CREATE NEW_BOOK
  const newBook = new Book({
    title,
    description,
    authors,
    favorite,
    fileCover: fileCoverPath,
    fileName,
    fileBook: fileBookPath,
  });

  // SAVE NEW_BOOK
  try {
    await newBook.save();
    res.redirect('/books');
  } catch (e) {
    console.error(e);
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  let book;

  try {
    book = await Book.findOne({ id });
  } catch (err) {
    console.error(err);
  }

  if (!book) {
    res.status(404).redirect('/404');
    return;
  }

  try {
    const counterData = await counterApi.post(id);

    res.render('books/view', {
      title: 'Book | view',
      book,
      viewsAmount: counterData.counter || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
});

router.get('/update/:id', async (req, res) => {
  const { id } = req.params;
  let book;

  try {
    book = await Book.findOne({ id });
  } catch (e) {
    console.error(e);
  }

  if (!book) {
    res.status(404).redirect('/404');
    return;
  }

  res.render('books/update', {
    title: 'Book | view',
    book,
  });
});

router.post(
  '/update/:id',
  fileMiddleware.fields(bookFiles),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, authors, favorite } = req.body;
    let book;

    const fileCover = req?.files?.fileCover;
    const fileBook = req?.files?.fileBook;

    try {
      book = await Book.findOne({ id });
    } catch (e) {
      console.error(e);
    }

    if (!book) {
      res.status(404).redirect('/404');
      return;
    }

    const fileCoverPath = fileCover ? fileCover[0]?.path : book.fileCover;
    const fileBookPath = fileBook ? fileBook[0]?.path : book.fileBook;
    const fileName = fileBook ? fileBook[0]?.originalname : book.fileName;

    try {
      book = Object.assign(book, {
        title,
        description,
        authors,
        favorite,
        fileCover: fileCoverPath,
        fileName,
        fileBook: fileBookPath,
      });
      await book.save();
    } catch (e) {
      console.error(e);
    }

    res.redirect(`/books/${id}`);
  }
);

router.post('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Book.findOneAndDelete({ id });
  } catch (err) {
    console.error(err);
    res.status(404).redirect('/404');
    return;
  }

  res.redirect(`/books`);
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
    res.status(404).redirect('/404');
    return;
  }

  res.download(__dirname + `/../../${book.fileBook}`, book.fileName, (err) => {
    if (err) {
      res.status(404);
      res.render('error/404', {
        title: '404 | Book file has not found',
      });
    }
  });
});

module.exports = router;
