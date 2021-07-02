const express = require('express');
const cors = require('cors');
const formData = require('express-form-data');

const { Book } = require('./models');

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
      `FileName ${el}`
    );
    store.books.push(newBook);
  });
};

addDefaultBooksToStore(store, [1, 2, 3]);

const app = express();

app.use(formData.parse());
app.use(cors());

app.post('/api/user/login', (req, res) => {
  const staticUser = { id: 1, mail: 'test@mail.ru' };

  res.status(201);
  res.json(staticUser);
});

app.get('/api/books/', (req, res) => {
  const { books } = store;
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
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

app.post('/api/books/', (req, res) => {
  const { books } = store;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;

  const newBook = new Book(
    title,
    description,
    authors,
    favorite,
    fileCover,
    fileName
  );
  books.push(newBook);

  res.status(201);
  res.json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const { books } = store;
  const { title, description, authors, favorite, fileCover, fileName } =
    req.body;
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
  });

  res.json(books[idx]);
});

app.delete('/api/books/:id', (req, res) => {
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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
