const express = require('express');
const router = express.Router();
const { Book } = require('../models');
const fileMiddleware = require('../middleware/book-file');

const store = {
  books: [],
};

const bookFiles = [
  { name: 'fileCover', maxCount: 1 },
  { name: 'fileBook', maxCount: 1 },
];

const addDefaultBooksToStore = (store, data) => {
  data.map((el) => {
    const newBook = new Book(
      `Book ${el}`,
      `description book ${el}`,
      `Authors book ${el}`,
      `Favorite book ${el}`,
      `public\\covers\\7-strategies-cover.jpg`,
      `7_Strategies_for_Wealth_and_Happiness.pdf`,
      `public\\books\\7_Strategies_for_Wealth_and_Happiness.fb2`
    );
    store.books.push(newBook);
  });
};

addDefaultBooksToStore(store, [1, 2, 3]);

router.get('/', (req, res) => {
  const { books } = store;

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

router.post('/create', fileMiddleware.fields(bookFiles), (req, res) => {
  const { books } = store;
  const { title, description, authors, favorite } = req.body;

  const fileCover = req?.files?.fileCover;
  const fileBook = req?.files?.fileBook;

  const fileCoverPath = fileCover ? fileCover[0]?.path : '';
  const fileBookPath = fileBook ? fileBook[0]?.path : '';
  const fileName = fileBook ? fileBook[0]?.originalname : '';

  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCoverPath,
    fileName,
    fileBookPath
  );
  books.push(newBook);

  res.redirect('/books');
});

router.get('/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx === -1) {
    res.status(404).redirect('/404');

    return;
  }

  res.render('books/view', {
    title: 'Book | view',
    book: books[idx],
  });
});

router.get('/update/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx === -1) {
    res.status(404).redirect('/404');

    return;
  }

  res.render('books/update', {
    title: 'Book | view',
    book: books[idx],
  });
});

router.post('/update/:id', fileMiddleware.fields(bookFiles), (req, res) => {
  const { books } = store;
  const { title, description, authors, favorite } = req.body;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx === -1) {
    res.status(404).redirect('/404');

    return;
  }

  const fileCover = req?.files?.fileCover;
  const fileBook = req?.files?.fileBook;

  const fileCoverPath = fileCover ? fileCover[0]?.path : books[idx].fileCover;
  const fileBookPath = fileBook ? fileBook[0]?.path : books[idx].fileBook;
  const fileName = fileBook ? fileBook[0]?.originalname : books[idx].fileName;

  books[idx] = Object.assign(books[idx], {
    title: title || books[idx].title,
    description: description || books[idx].description,
    authors: authors || books[idx].authors,
    favorite: favorite || books[idx].favorite,
    fileCover: fileCoverPath,
    fileName: fileName,
    fileBook: fileBookPath,
  });

  res.redirect(`/books/${id}`);
});

router.post('/delete/:id', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx === -1) {
    res.status(404).redirect('/404');
  }

  books.splice(idx, 1);
  res.redirect(`/books`);
});

router.get('/:id/download', (req, res) => {
  const { books } = store;
  const { id } = req.params;
  const idx = books.findIndex((el) => el.id === id);

  if (idx === -1) {
    res.status(404).redirect('/404');
    return;
  }

  const bookPath = books[idx].fileBook;
  const bookName = books[idx].fileName;

  res.download(__dirname + `/../${bookPath}`, bookName, (err) => {
    if (err) {
      res.status(404);
      res.render('error/404', {
        title: '404 | Book file has not found',
      });
    }
  });
});

module.exports = router;
