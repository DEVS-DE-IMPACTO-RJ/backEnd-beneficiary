const url = require('url');
const supabase = require('../config/supabase');

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

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(data));
  }

  // Demonstrar Interesse em Publicação
  if (path.match(/\/api\/publicacoes\/\d+\/interesse$/) && method === 'POST') {
    const publicacaoId = parseInt(path.split('/')[3]);
    const body = await parseBody(req);
    
    // Verifica se a publicação existe no banco
    const { data: publicacao, error: pubError } = await supabase
      .from('publications')
      .select('id, titulo')
      .eq('id', publicacaoId)
      .eq('status', 'PUBLISHED')
      .single();
    
    if (pubError || !publicacao) {
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
