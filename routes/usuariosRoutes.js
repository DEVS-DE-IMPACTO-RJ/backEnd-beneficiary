const url = require('url');

let perfis = [];
let proximoIdPerfil = 1;

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

const usuariosRoutes = async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Criar perfil (Cadastro de BENEFICIARIO)
  if (path === '/api/perfil' && method === 'POST') {
    const body = await parseBody(req);
    
    const novoPerfil = {
      id: proximoIdPerfil++,
      nome: body.nome,
      email: body.email,
      telefone: body.telefone,
      endereco: body.endereco,
      tipo_usuario: 'BENEFICIARIO',
      cpf: body.cpf,
      data_nascimento: body.data_nascimento,
      numero_dependentes: body.numero_dependentes || 0,
      restricoes_alimentares: body.restricoes_alimentares || [],
      criado_em: new Date().toISOString()
    };
    
    perfis.push(novoPerfil);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ 
      mensagem: 'Perfil criado com sucesso!', 
      perfil: novoPerfil 
    }));
  }

  // Ver perfil por ID
  if (path.match(/\/api\/perfil\/\d+$/) && method === 'GET') {
    const id = parseInt(path.split('/')[3]);
    
    const perfil = perfis.find(p => p.id === id);
    
    if (!perfil) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: 'Perfil não encontrado' }));
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(perfil));
  }

  // Atualizar perfil
  if (path.match(/\/api\/perfil\/\d+$/) && method === 'PUT') {
    const id = parseInt(path.split('/')[3]);
    const body = await parseBody(req);

    const perfil = perfis.find(p => p.id === id);
    
    if (!perfil) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: 'Perfil não encontrado' }));
    }

    // Atualizar campos
    if (body.nome) perfil.nome = body.nome;
    if (body.telefone) perfil.telefone = body.telefone;
    if (body.endereco) perfil.endereco = body.endereco;
    if (body.restricoes_alimentares) perfil.restricoes_alimentares = body.restricoes_alimentares;
    if (body.numero_dependentes !== undefined) perfil.numero_dependentes = body.numero_dependentes;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ 
      mensagem: 'Perfil atualizado com sucesso!', 
      perfil: perfil 
    }));
  }

  // Deletar perfil
  if (path.match(/\/api\/perfil\/\d+$/) && method === 'DELETE') {
    const id = parseInt(path.split('/')[3]);
    
    const index = perfis.findIndex(p => p.id === id);
    
    if (index === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: 'Perfil não encontrado' }));
    }

    perfis.splice(index, 1);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ mensagem: 'Perfil deletado com sucesso!' }));
  }

  return null;
};

module.exports = usuariosRoutes;
