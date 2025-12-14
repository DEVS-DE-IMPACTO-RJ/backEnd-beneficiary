const http = require('http');
const usuariosRoutes = require('./routes/usuariosRoutes');
const openaiRoutes = require('./routes/openaiRoutes');
const coletasRoutes = require('./routes/coletasRoutes');
const publicacoesRoutes = require('./routes/publicacoesRoutes');
const OpenAI = require('openai');
require('dotenv').config();

// Inicializar Groq usando a biblioteca OpenAI
const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const PORT = 3334;

const server = http.createServer(async (req, res) => {
  // Habilitar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  // Tentar rotas de usuários
  const usuariosResult = await usuariosRoutes(req, res);
  if (usuariosResult !== null) return;

  // Tentar rotas de coletas
  const coletasResult = await coletasRoutes(req, res);
  if (coletasResult !== null) return;

  // Tentar rotas de publicações
  const publicacoesResult = await publicacoesRoutes(req, res);
  if (publicacoesResult !== null) return;

  // Tentar rotas de OpenAI/Groq
  const openaiResult = await openaiRoutes(req, res, groqClient);
  if (openaiResult !== null) return;

  // Rota não encontrada
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ erro: 'Rota não encontrada' }));
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('API pronta para testes!');
});
