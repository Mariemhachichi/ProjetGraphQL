
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: String,
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true,
  },
});

const book= mongoose.model('Book', bookSchema);
export default book;

