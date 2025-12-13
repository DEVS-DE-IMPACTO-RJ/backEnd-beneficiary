const url = require('url');

let coletas = [];

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

const coletasRoutes = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Agendar coleta de cesta básica
  if (path === '/api/minhas-coletas' && method === 'POST') {
    const body = await parseBody(req);
    const novaColeta = {
      id: coletas.length + 1,
      usuarioId: body.usuarioId,
      estabelecimento: body.estabelecimento,
      endereco: body.endereco,
      data: body.data,
      horario: body.horario,
      tipoCesta: body.tipoCesta || 'básica',
      observacoes: body.observacoes,
      status: 'pendente',
      criadoEm: new Date().toISOString()
    };
    coletas.push(novaColeta);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ 
      mensagem: 'Coleta de cesta básica agendada com sucesso!', 
      coleta: novaColeta 
    }));
  }

  // Ver minhas coletas
  if (path.match(/\/api\/minhas-coletas\/\d+$/) && method === 'GET') {
    const usuarioId = parseInt(path.split('/')[3]);
    const minhasColetas = coletas.filter(c => c.usuarioId === usuarioId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(minhasColetas));
  }

  // Cancelar minha coleta
  if (path.match(/\/api\/minhas-coletas\/cancelar\/\d+$/) && method === 'DELETE') {
    const id = parseInt(path.split('/')[4]);
    const index = coletas.findIndex(c => c.id === id);
    if (index === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: 'Coleta não encontrada' }));
    }
    coletas.splice(index, 1);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ mensagem: 'Coleta cancelada com sucesso!' }));
  }

  return null;
};

module.exports = coletasRoutes;
