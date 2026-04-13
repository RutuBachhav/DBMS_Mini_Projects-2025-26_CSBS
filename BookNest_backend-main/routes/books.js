import express from 'express';
import Book from '../models/Book.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

// Get all books (any authenticated user) — supports ?search=keyword
router.get('/', authenticate, async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search && search.trim()) {
      const regex = { $regex: search.trim(), $options: 'i' };
      filter = { $or: [{ title: regex }, { author: regex }] };
    }

    const books = await Book.find(filter).populate('addedBy', 'name').sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search books (any authenticated user)
router.get('/search', authenticate, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) return res.json([]);

    const books = await Book.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } },
        { isbn: { $regex: q, $options: 'i' } },
        { genre: { $regex: q, $options: 'i' } },
      ],
    }).populate('addedBy', 'name').sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add book (staff/admin only)
router.post('/', authenticate, authorize('staff', 'admin'), async (req, res) => {
  try {
    const { title, author, isbn, genre, totalCopies } = req.body;

    if (!title || !author || !isbn || !totalCopies) {
      return res.status(400).json({ message: 'Title, author, ISBN, and total copies are required' });
    }

    const existing = await Book.findOne({ isbn });
    if (existing) {
      return res.status(400).json({ message: 'A book with this ISBN already exists' });
    }

    const book = new Book({
      title,
      author,
      isbn,
      genre: genre || '',
      totalCopies: Number(totalCopies),
      availableCopies: Number(totalCopies),
      addedBy: req.user._id,
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update book (staff/admin only)
router.put('/:id', authenticate, authorize('staff', 'admin'), async (req, res) => {
  try {
    const { title, author, isbn, genre, totalCopies } = req.body;
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (isbn) book.isbn = isbn;
    if (genre !== undefined) book.genre = genre;

    if (totalCopies !== undefined) {
      const diff = Number(totalCopies) - book.totalCopies;
      book.totalCopies = Number(totalCopies);
      book.availableCopies = Math.max(0, book.availableCopies + diff);
    }

    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete book (staff/admin only)
router.delete('/:id', authenticate, authorize('staff', 'admin'), async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
