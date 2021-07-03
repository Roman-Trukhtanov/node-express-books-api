const express = require('express');
const router = express.Router();
const { Book } = require('../models');
const fileMiddleware = require('../middleware/file');

const store = {
  books: [],
};

const addDefaultBooksToStore = (store, data) => {
  data.map((el) => {
    const newBook = new Book(
      `Book ${el}`,
      `description book ${el}`,
      `Authors book ${el}`,
      `Favorite book ${el}`,
      `FileCover ${el}`,
      `FileName ${el}`,
      `public\\books\\7_Strategies_for_Wealth_and_Happiness.fb2`
    );
    store.books.push(newBook);
  });
};

addDefaultBooksToStore(store, [1, 2, 3]);

router.get('/', (req, res) => {
  const { books } = store;
  res.json(books);
});

router.get('/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx === -1) {
    res.status(404);
    res.json('Book | not found');

    return;
  }

  res.json(books[idx]);
});

router.post('/', (req, res) => {
  const { books } = store;
  const {
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook,
  } = req.body;

  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName,
    fileBook
  );
  books.push(newBook);

  res.status(201);
  res.json(newBook);
});

router.put('/:id', (req, res) => {
  const { books } = store;
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
  const idx = books.findIndex((el) => el.id === id);

  if (idx === -1) {
    res.status(404);
    res.json('Book | not found');

    return;
  }

  books[idx] = Object.assign(books[idx], {
    title: title || books[idx].title,
    description: description || books[idx].description,
    authors: authors || books[idx].authors,
    favorite: favorite || books[idx].favorite,
    fileCover: fileCover || books[idx].fileCover,
    fileName: fileName || books[idx].fileName,
    fileBook: fileBook || books[idx].fileBook,
  });

  res.json(books[idx]);
});

router.delete('/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx === -1) {
    res.status(404);
    res.json('Book | not found');
  }

  books.splice(idx, 1);
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

router.get('/:id/download', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx === -1) {
    res.status(404);
    res.json('Book file | not found');

    return;
  }

  const bookPath = books[idx].fileBook;
  const bookName = books[idx].fileName;

  console.log(__dirname + `/../${bookPath}`);

  res.download(__dirname + `/../${bookPath}`, bookName, (err) => {
    if (err) {
      res.status(404).json();
    }
  });
});

module.exports = router;
