import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Padrão de conexão em cache para ambientes Serverless (como Vercel).
 * Evita a criação de conexões múltiplas e simultâneas em cada invocação fria/quente.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ AVISO: MONGODB_URI não foi definida nas variáveis de ambiente.');
    console.warn('ℹ️ A API operará em modo de simulação em memória (Mock Mode) para testes locais.');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log('✅ Conectado com sucesso ao MongoDB via Mongoose!');
      return mongooseInstance;
    }).catch((err) => {
      console.error('❌ Falha na conexão com o MongoDB:', err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export function isConnected() {
  return mongoose.connection.readyState === 1;
}
