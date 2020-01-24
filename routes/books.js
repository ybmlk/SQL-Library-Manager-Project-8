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

/* GET users listing. */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [['title', 'ASC']] });
    res.render('books/index', { books });
  })
);

module.exports = router;
