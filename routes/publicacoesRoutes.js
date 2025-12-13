const url = require('url');

// Mock de publicações (pode usar o mesmo do openaiRoutes)
let publicacoes = [
  {
    id: 1,
    titulo: "Cesta Básica Completa",
    alimentos: ["leite", "ovos", "farinha de trigo", "tomate", "cebola", "batata", "cenoura", "arroz", "feijão"],
    peso: "8kg",
    estabelecimento: "Padaria Pão Nosso",
    endereco: "Rua das Acácias, 456"
  },
  {
    id: 2,
    titulo: "Cesta de Frutas e Laticínios",
    alimentos: ["banana", "maçã", "laranja", "mamão", "iogurte", "queijo", "manteiga"],
    peso: "5kg",
    estabelecimento: "Mercado Central",
    endereco: "Av. Principal, 789"
  },
  {
    id: 3,
    titulo: "Cesta Orgânica Semanal",
    alimentos: ["alface", "brócolis", "couve", "rúcula", "tomate orgânico", "cenoura orgânica"],
    peso: "4kg",
    estabelecimento: "Feira Orgânica",
    endereco: "Praça Verde, s/n"
  }
];

let interesses = [];
let proximoIdInteresse = 0;

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

  // Ver Publicações Disponíveis
  if (path === '/api/publicacoes' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(publicacoes));
  }

  // Demonstrar Interesse em Publicação
  if (path.match(/\/api\/publicacoes\/\d+\/interesse$/) && method === 'POST') {
    const publicacaoId = parseInt(path.split('/')[3]);
    const body = await parseBody(req);
    
    const publicacao = publicacoes.find(p => p.id === publicacaoId);
    if (!publicacao) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: 'Publicação não encontrada' }));
    }

    const novoInteresse = {
      id: ++proximoIdInteresse,
      publicacaoId: publicacaoId,
      usuarioId: body.usuarioId,
      publicacao: publicacao.titulo,
      criadoEm: new Date().toISOString()
    };
    
    interesses.push(novoInteresse);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ 
      mensagem: 'Interesse registrado com sucesso!', 
      interesse: novoInteresse 
    }));
  }

  // Ver Minhas Reações/Interesses
  if (path.match(/\/api\/minhas-reacoes\/\d+$/) && method === 'GET') {
    const usuarioId = parseInt(path.split('/')[3]);
    const meusInteresses = interesses.filter(i => i.usuarioId === usuarioId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(meusInteresses));
  }

  return null;
};

module.exports = publicacoesRoutes;
