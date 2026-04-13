import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  readerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  type: {
    type: String,
    enum: ['issue', 'request'],
    default: 'issue',
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    default: null,
  },
  returnDate: {
    type: Date,
    default: null,
  },
  fine: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'issued', 'approved', 'returned'],
    default: 'issued',
  },
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
