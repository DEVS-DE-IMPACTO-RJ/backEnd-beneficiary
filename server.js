const http = require('http');
const usuariosRoutes = require('./routes/usuariosRoutes');
const coletasRoutes = require('./routes/coletasRoutes');
const publicacoesRoutes = require('./routes/publicacoesRoutes');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  try {
    // Tentar rotas de usuárias
    const usuarioResult = await usuariosRoutes(req, res);
    if (usuarioResult !== null) return;

    // Tentar rotas de coletas
    const coletaResult = await coletasRoutes(req, res);
    if (coletaResult !== null) return;

    // Tentar rotas de publicações
    const publicacaoResult = await publicacoesRoutes(req, res);
    if (publicacaoResult !== null) return;

    // Rota raiz
    if (req.url === '/' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(`
        <h1>API de Coleta de Cesta Básica - Perfil Maria</h1>
        <h2>Rotas Disponíveis:</h2>
        
        <h3>👤 Gerenciar Meu Perfil</h3>
        <ul>
          <li><strong>POST</strong> /api/perfil - Criar meu perfil</li>
          <li><strong>GET</strong> /api/perfil/:id - Ver meu perfil</li>
          <li><strong>PUT</strong> /api/perfil/:id - Atualizar meu perfil</li>
          <li><strong>DELETE</strong> /api/perfil/:id - Deletar meu perfil</li>
        </ul>

        <h3>🛒 Minhas Coletas</h3>
        <ul>
          <li><strong>POST</strong> /api/minhas-coletas - Agendar coleta de cesta básica</li>
          <li><strong>GET</strong> /api/minhas-coletas/:usuarioId - Ver minhas coletas</li>
          <li><strong>DELETE</strong> /api/minhas-coletas/cancelar/:id - Cancelar coleta</li>
        </ul>

        <h3>📢 Publicações de Estabelecimentos</h3>
        <ul>
          <li><strong>GET</strong> /api/publicacoes - Ver publicações disponíveis</li>
          <li><strong>POST</strong> /api/publicacoes/:id/interesse - Demonstrar interesse</li>
          <li><strong>GET</strong> /api/minhas-reacoes/:usuarioId - Ver minhas reações</li>
        </ul>
      `);
    }

    // Rota não encontrada
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ erro: 'Rota não encontrada' }));

  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ erro: 'Erro ao processar requisição', detalhes: error.message }));
  }
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log('API pronta para testes!');
});
