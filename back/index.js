import { createYoga } from 'graphql-yoga';
import { createServer } from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import connectDB from './config/db.js';
import typeDefs from './schema/typeDefs.js';
import resolvers from './schema/resolvers.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

// 📦 Connexion MongoDB
connectDB();

// 🛠️ Création du schéma GraphQL
const schema = makeExecutableSchema({ typeDefs, resolvers });

// 🔐 Fonction pour décoder le token JWT
const getUser = (req) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) return null;

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    return user;
  } catch (error) {
    return null;
  }
};

// 🚀 Création du serveur Yoga avec contexte pour l'authentification
const yoga = createYoga({
  schema,
  context: ({ request }) => {
    const user = getUser(request);
    return { user }; // ➕ On passe l'utilisateur dans le contexte
  },
});

// 🌐 Création du serveur HTTP
const server = createServer(yoga);

// 🚀 Lancement du serveur
server.listen(4000, () => {
  console.log('🚀 Serveur GraphQL sur http://localhost:4000/graphql');
});
