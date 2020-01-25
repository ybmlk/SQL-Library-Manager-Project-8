const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}

/* GET books listing. */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [['title', 'ASC']] });
    res.render('books/index', { books, title: 'Books' });
  })
);

/* Create a new book form. */
router.get(
  '/new',
  asyncHandler(async (req, res) => {
    res.render('books/new', { book: {}, title: 'New Book' });
  })
);

/* Post create book. */
router.post(
  '/new',
  asyncHandler(async (req, res) => {
    await Book.create(req.body);
    res.redirect('/books/');
  })
);

/* Show/Edit individual book. */
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('books/edit', { book, title: book.title });
    } else {
      res.status(404).render('404', { msg: 'book', title: 'Page Not Found' });
    }
  })
);

/* Update a book. */
router.post(
  '/:id',
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
    } else {
      res.status(404).render('404', { msg: 'book', title: 'Page Not Found' });
    }
    res.redirect('/books');
  })
);

/* Delete book form. */
router.get(
  '/:id/delete',
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render('books/delete', { book, title: 'Delete Book' });
    } else {
      res.status(404).render('404', { msg: 'book', title: 'Page Not Found' });
    }
  })
);

/* Delete book confirmed */
router.post(
  '/:id/delete',
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect('/books');
    } else {
      res.status(404).render('404', { msg: 'book', title: 'Page Not Found' });
    }
  })
);

module.exports = router;
