import { createYoga } from 'graphql-yoga';
import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import schema from './schema/schema.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');

    const yoga = createYoga({ schema });

    const server = http.createServer(yoga);

    server.listen(PORT, () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}/graphql`);
    });

  } catch (err) {
    console.error('Erreur de connexion MongoDB:', err);
  }
}

main();
