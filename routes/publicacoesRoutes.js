const url = require('url');

let publicacoes = [
  { 
    id: 1, 
    estabelecimento: 'Padaria Pão Nosso',
    titulo: 'Cestas básicas disponíveis', 
    descricao: 'Pães, arroz, feijão e óleo',
    endereco: 'Rua das Acácias, 456',
    horarioColeta: '14:00 às 18:00',
    reacoes: [] 
  },
  { 
    id: 2, 
    estabelecimento: 'Mercado Bom Preço',
    titulo: 'Doação de alimentos', 
    descricao: 'Frutas, legumes e verduras',
    endereco: 'Av. Principal, 789',
    horarioColeta: '10:00 às 16:00',
    reacoes: [] 
  }
];

const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
};

const publicacoesRoutes = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Listar publicações de estabelecimentos
  if (path === '/api/publicacoes' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(publicacoes));
  }

  // Demonstrar interesse em uma publicação
  if (path.match(/\/api\/publicacoes\/\d+\/interesse$/) && method === 'POST') {
    const id = parseInt(path.split('/')[3]);
    const body = await parseBody(req);
    const publicacao = publicacoes.find(p => p.id === id);
    
    if (!publicacao) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: 'Publicação não encontrada' }));
    }

    // Verificar se já demonstrou interesse
    const jaReagiu = publicacao.reacoes.find(r => r.usuarioId === body.usuarioId);
    if (jaReagiu) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: 'Você já demonstrou interesse nesta publicação' }));
    }

    const interesse = {
      usuarioId: body.usuarioId,
      tipo: 'interesse',
      data: new Date().toISOString()
    };

    publicacao.reacoes.push(interesse);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ 
      mensagem: 'Interesse registrado com sucesso!', 
      publicacao 
    }));
  }

  // Ver minhas reações
  if (path.match(/\/api\/minhas-reacoes\/\d+$/) && method === 'GET') {
    const usuarioId = parseInt(path.split('/')[3]);
    const minhasReacoes = publicacoes
      .filter(p => p.reacoes.some(r => r.usuarioId === usuarioId))
      .map(p => ({
        publicacaoId: p.id,
        estabelecimento: p.estabelecimento,
        titulo: p.titulo,
        reacao: p.reacoes.find(r => r.usuarioId === usuarioId)
      }));
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(minhasReacoes));
  }

  return null;
};

module.exports = publicacoesRoutes;
