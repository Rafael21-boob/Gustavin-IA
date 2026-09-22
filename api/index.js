import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Se for executado diretamente no terminal (Node local), inicia o servidor HTTP
// Na Vercel, o Express `app` é exportado como Serverless Function
if (process.env.NODE_ENV !== 'test') {
  const isDirectRun = !process.env.VERCEL;
  if (isDirectRun) {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend rodando em http://localhost:${PORT}`);
      console.log(`📄 Healthcheck disponível em http://localhost:${PORT}/api/health`);
      console.log(`🚗 CRUD de carros disponível em http://localhost:${PORT}/api/cars`);
    });
  }
}

export default app;
