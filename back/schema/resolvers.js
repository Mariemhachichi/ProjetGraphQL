import Author from '../models/Author.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET = process.env.JWT_SECRET || 'SECRET_KEY'; // 🔥 Ajoute une valeur par défaut pour le développement

const resolvers = {
  Query: {
    // 🔐 Voir son profil
    me: async (_, __, { user }) => {
      if (!user) throw new Error('❌ Non authentifié');
      const currentUser = await User.findById(user.id);
      return currentUser;
    },

    // ✅ Récupérer tous les auteurs
    authors: async () => await Author.find(),

    // ✅ Récupérer un auteur par ID
    author: async (_, { id }) => await Author.findById(id),

    // ✅ Récupérer tous les livres
    books: async () => await Book.find(),

    // ✅ Récupérer un livre par ID
    book: async (_, { id }) => await Book.findById(id),
  },

  Mutation: {
    // 🔐 Inscription
    register: async (_, { username, password }) => {
      const existingUser = await User.findOne({ username });
      if (existingUser) throw new Error('❌ Utilisateur déjà existant');

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, password: hashedPassword });
      await user.save();

      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET,
        { expiresIn: '1d' }
      );

      return { id: user.id, username: user.username, token };
    },

    // 🔐 Connexion
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error('❌ Utilisateur non trouvé');

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error('❌ Mot de passe incorrect');

      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET,
        { expiresIn: '1d' }
      );

      return { id: user.id, username: user.username, token };
    },

    // ➕ Ajouter un auteur (authentifié)
    addAuthor: async (_, { name }, { user }) => {
      if (!user) throw new Error('❌ Non authentifié');
      const author = new Author({ name });
      await author.save();
      return author;
    },

    // ➕ Ajouter un livre (authentifié)
    addBook: async (_, { title, genre, authorId }, { user }) => {
      if (!user) throw new Error('❌ Non authentifié');

      const authorExists = await Author.findById(authorId);
      if (!authorExists) throw new Error('❌ Auteur non trouvé');

      const book = new Book({ title, genre, authorId });
      await book.save();
      return book;
    },

    // ❌ Supprimer un livre (authentifié)
    deleteBook: async (_, { id }, { user }) => {
      if (!user) throw new Error('❌ Non authentifié');

      const book = await Book.findByIdAndDelete(id);
      if (!book) throw new Error('❌ Livre non trouvé');

      return '✅ Livre supprimé avec succès';
    },

    // ❌ Supprimer un auteur et ses livres (authentifié)
    deleteAuthor: async (_, { id }, { user }) => {
      if (!user) throw new Error('❌ Non authentifié');

      const author = await Author.findByIdAndDelete(id);
      if (!author) throw new Error('❌ Auteur non trouvé');

      await Book.deleteMany({ authorId: id });
      return '✅ Auteur et ses livres supprimés avec succès';
    },

    // 🔄 Modifier un auteur (authentifié)
    updateAuthor: async (_, { id, name }, { user }) => {
      if (!user) throw new Error('❌ Non authentifié');

      const author = await Author.findByIdAndUpdate(
        id,
        { name },
        { new: true }
      );
      if (!author) throw new Error('❌ Auteur non trouvé');
      return author;
    },

    // 🔄 Modifier un livre (authentifié)
    updateBook: async (_, { id, title, genre, authorId }, { user }) => {
      if (!user) throw new Error('❌ Non authentifié');

      const updateFields = {};
      if (title) updateFields.title = title;
      if (genre) updateFields.genre = genre;
      if (authorId) {
        const authorExists = await Author.findById(authorId);
        if (!authorExists) throw new Error('❌ Auteur non trouvé');
        updateFields.authorId = authorId;
      }

      const book = await Book.findByIdAndUpdate(id, updateFields, {
        new: true,
      });
      if (!book) throw new Error('❌ Livre non trouvé');
      return book;
    },
  },

  // 🔗 Résolution relationnelle
  Author: {
    books: async (parent) => {
      return await Book.find({ authorId: parent.id });
    },
  },

  Book: {
    author: async (parent) => {
      return await Author.findById(parent.authorId);
    },
  },
};

export default resolvers;
