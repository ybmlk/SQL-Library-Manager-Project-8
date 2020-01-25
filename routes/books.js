const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Op } = require('sequelize');

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

/* Get search results */
router.get(
  '/search',
  asyncHandler(async (req, res) => {
    const { search } = req.query;
    const books = await Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${search}%` } },
          { author: { [Op.like]: `%${search}%` } },
          { genre: { [Op.like]: `%${search}%` } },
          { year: { [Op.like]: `%${search}%` } }
        ]
      }
    });

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
    try {
      await Book.create(req.body);
      res.redirect('/books/');
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        // checking the error
        const book = await Book.build(req.body);
        res.render('books/new', { book, errors: error.errors, title: 'New Book' });
      } else {
        throw error; // error caught in the asyncHandler's catch block
      }
    }
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
      res.status(404).render('404', { msg: 'Book', title: 'Page Not Found' });
    }
  })
);

/* Update a book. */
router.post(
  '/:id',
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect('/books/');
      } else {
        res.status(404).render('404', { msg: 'Book', title: 'Page Not Found' });
      }
      res.redirect('/books');
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        book = await Book.build(req.body);
        book.id = req.params.id; // make sure correct article gets updated
        res.render('books/edit', { book, errors: error.errors, title: 'Update Book' });
      } else {
        throw error;
      }
    }
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
      res.status(404).render('404', { msg: 'Book', title: 'Page Not Found' });
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
      res.status(404).render('404', { msg: 'Book', title: 'Page Not Found' });
    }
  })
);

module.exports = router;
