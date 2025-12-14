const url = require('url');
const supabase = require('../config/supabase');

let interesses = [];
let proximoIdInteresse = 0;

// Dados mockados para testes (quando banco estiver vazio)
const publicacoesMock = [
  {
    id: 1,
    titulo: "Cesta Básica Completa",
    alimentos: ["arroz", "feijão", "óleo", "açúcar", "café", "leite"],
    peso: "8kg",
    estabelecimento: "Padaria Pão Nosso",
    endereco: "Rua das Acácias, 456",
    status: "PUBLISHED"
  },
  {
    id: 2,
    titulo: "Cesta de Frutas e Verduras",
    alimentos: ["banana", "maçã", "tomate", "alface", "cenoura"],
    peso: "5kg",
    estabelecimento: "Hortifruti Silva",
    endereco: "Av. Central, 789",
    status: "PUBLISHED"
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

  // Ver Publicações Disponíveis (PUBLISHED)
  if (path === '/api/publicacoes' && method === 'GET') {
    const { data, error } = await supabase
      .from('publications')
      .select('*')
      .eq('status', 'PUBLISHED');

    if (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: error.message }));
    }

    // Se não houver publicações no banco, retorna dados mockados
    const publicacoes = data && data.length > 0 ? data : publicacoesMock;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(publicacoes));
  }

  // Demonstrar Interesse em Publicação
  if (path.match(/\/api\/publicacoes\/[^\/]+\/interesse$/) && method === 'POST') {
    const publicacaoId = path.split('/')[3]; // Pode ser número ou UUID
    const body = await parseBody(req);
    
    console.log('🔍 Buscando publicação ID:', publicacaoId);
    console.log('📋 Tipo do ID:', typeof publicacaoId);
    
    // Tenta buscar no banco primeiro (REMOVE o filtro .eq('status', 'PUBLISHED') para debug)
    const { data: publicacoes, error: pubError } = await supabase
      .from('publications')
      .select('*')
      .eq('id', publicacaoId);
    
    console.log('📦 Dados retornados do Supabase:', publicacoes);
    console.log('❌ Erro Supabase:', pubError);
    console.log('📊 Quantidade de resultados:', publicacoes?.length || 0);
    
    // Pega a primeira publicação encontrada
    let publicacaoEncontrada = publicacoes && publicacoes.length > 0 ? publicacoes[0] : null;
    
    // Se não encontrar no banco, busca nos dados mockados
    if (!publicacaoEncontrada) {
      publicacaoEncontrada = publicacoesMock.find(p => p.id == publicacaoId);
      console.log('📦 Publicação mockada encontrada:', publicacaoEncontrada);
      
      if (!publicacaoEncontrada) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ 
          erro: 'Publicação não encontrada',
          idBuscado: publicacaoId,
          tipoId: typeof publicacaoId,
          detalhes: 'Verifique se o ID existe no banco de dados'
        }));
      }
    }

    const novoInteresse = {
      id: ++proximoIdInteresse,
      publicacaoId: publicacaoId,
      usuarioId: body.usuarioId,
      publicacao: publicacaoEncontrada.titulo || publicacaoEncontrada.title,
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
  if (path.match(/\/api\/minhas-reacoes\/[^\/]+$/) && method === 'GET') {
    const usuarioId = path.split('/')[3]; // Pode ser número ou UUID
    const meusInteresses = interesses.filter(i => i.usuarioId == usuarioId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(meusInteresses));
  }

  return null;
};

module.exports = publicacoesRoutes;
