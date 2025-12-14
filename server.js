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
fetch('http://localhost:3334/api/publicacoes')
  .then(res => res.json())
  .then(data => console.log('✅ CORS funcionando!', data))
  .catch(err => console.error('❌ Erro CORS:', err));
// Função para aplicar CORS
const applyCORS = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 horas
};

const server = http.createServer(async (req, res) => {
  // Aplicar CORS em todas as requisições
  applyCORS(res);

  // Tratar requisições OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(204); // No Content
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
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📡 CORS habilitado para todas as origens`);
  console.log(`✅ API pronta para testes!`);
});
