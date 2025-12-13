const url = require('url');

let usuarios = [];
let proximoId = 0;

// Função para obter o próximo ID único
const obterProximoId = () => {
  if (usuarios.length === 0) {
    return 1;
  }
  const maiorId = Math.max(...usuarios.map(u => u.id));
  return maiorId + 1;
};

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

  // Criar perfil (Cadastro)
  if (path === '/api/perfil' && method === 'POST') {
    const body = await parseBody(req);
    const novoPerfil = {
      id: obterProximoId(),
      nome: body.nome,
      email: body.email,
      telefone: body.telefone,
      endereco: body.endereco,
      criadoEm: new Date().toISOString()
    };
    usuarios.push(novoPerfil);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ 
      mensagem: 'Perfil criado com sucesso!', 
      perfil: novoPerfil 
    }));
  }

  // Ver meu perfil
  if (path.match(/\/api\/perfil\/\d+$/) && method === 'GET') {
    const id = parseInt(path.split('/')[3]);
    const perfil = usuarios.find(u => u.id === id);
    if (!perfil) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: 'Perfil não encontrado' }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(perfil));
  }

  // Atualizar meu perfil
  if (path.match(/\/api\/perfil\/\d+$/) && method === 'PUT') {
    const id = parseInt(path.split ('/')[3]);
    const body = await parseBody(req);
    const perfilIndex = usuarios.findIndex(u => u.id === id);
    
    if (perfilIndex === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: 'Perfil não encontrado' }));
    }

    usuarios[perfilIndex] = {
      ...usuarios[perfilIndex],
      nome: body.nome || usuarios[perfilIndex].nome,
      email: body.email || usuarios[perfilIndex].email,
      telefone: body.telefone || usuarios[perfilIndex].telefone,
      endereco: body.endereco || usuarios[perfilIndex].endereco,
      atualizadoEm: new Date().toISOString()
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ 
      mensagem: 'Perfil atualizado com sucesso!', 
      perfil: usuarios[perfilIndex] 
    }));
  }

  // Deletar meu perfil
  if (path.match(/\/api\/perfil\/\d+$/) && method === 'DELETE') {
    const id = parseInt(path.split('/')[3]);
    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: 'Perfil não encontrado' }));
    }
    usuarios.splice(index, 1);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ mensagem: 'Perfil deletado com sucesso!' }));
  }

  return null;
};

module.exports = usuariosRoutes;
