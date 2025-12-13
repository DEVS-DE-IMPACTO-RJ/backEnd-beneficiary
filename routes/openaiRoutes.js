const url = require('url');

// Mock de publicações com ingredientes mais realistas
let publicacoes = [
  {
    id: 1,
    titulo: "Cesta Básica Completa",
    alimentos: ["leite", "ovos", "farinha de trigo", "tomate", "cebola", "batata", "cenoura", "arroz", "feijão", "açúcar"],
    peso: "8kg"
  },
  {
    id: 2,
    titulo: "Cesta de Frutas e Laticínios",
    alimentos: ["banana", "maçã", "laranja", "mamão", "iogurte", "queijo", "manteiga"],
    peso: "5kg"
  },
  {
    id: 3,
    titulo: "Cesta Orgânica Semanal",
    alimentos: ["alface", "brócolis", "couve", "rúcula", "tomate orgânico", "cenoura orgânica"],
    peso: "4kg"
  }
];

// Mock de resposta da IA
const gerarDicasMock = (alimentos) => {
  return {
    dicas_nutricionais: [
      `Os alimentos ${alimentos.slice(0, 2).join(' e ')} são ricos em vitaminas e minerais essenciais para a saúde.`,
      `Esta combinação de ingredientes fornece proteínas, carboidratos e fibras importantes para uma dieta equilibrada.`,
      `Consuma estes alimentos frescos e armazenados corretamente para aproveitar ao máximo seus benefícios nutricionais.`
    ],
    receitas: [
      {
        nome: `Salada Completa com ${alimentos[0]}`,
        ingredientes: alimentos.slice(0, 4),
        modo_preparo: `1. Lave bem todos os ingredientes em água corrente. 2. Corte ${alimentos[0]} em cubos médios. 3. Pique ${alimentos[1] || 'os vegetais'} finamente. 4. Misture tudo em uma tigela. 5. Tempere com azeite, limão, sal e pimenta a gosto. 6. Sirva imediatamente.`,
        tempo_preparo: "20 minutos",
        porcoes: "3 porções"
      },
      {
        nome: `Refogado Nutritivo`,
        ingredientes: alimentos.slice(1, 5),
        modo_preparo: `1. Aqueça uma panela com um fio de óleo. 2. Adicione cebola e alho picados e refogue até dourar. 3. Acrescente os demais ingredientes cortados. 4. Tempere com sal, pimenta e ervas de sua preferência. 5. Cozinhe em fogo médio por 15-20 minutos até ficarem macios. 6. Sirva quente.`,
        tempo_preparo: "30 minutos",
        porcoes: "4 porções"
      },
      {
        nome: `Preparo Rápido Saudável`,
        ingredientes: alimentos.slice(0, 3),
        modo_preparo: `1. Higienize todos os ingredientes. 2. Prepare uma base com ${alimentos[0]}. 3. Combine com ${alimentos[1] || 'outros ingredientes'} de forma criativa. 4. Tempere conforme seu gosto pessoal. 5. Finalize e sirva em temperatura ambiente ou aquecido.`,
        tempo_preparo: "25 minutos",
        porcoes: "2 porções"
      }
    ]
  };
};

const filtrarAlimentosPorRestricoes = (alimentos, restricoes) => {
  const alimentosProibidos = {
    'sem lactose': ['leite', 'queijo', 'manteiga', 'iogurte', 'creme de leite', 'requeijão'],
    'sem glúten': ['farinha de trigo', 'pão', 'macarrão', 'biscoito', 'trigo'],
    'vegana': ['leite', 'ovos', 'queijo', 'manteiga', 'iogurte', 'creme de leite', 'mel', 'frango', 'carne', 'peixe'],
    'vegetariana': ['frango', 'carne', 'carne moída', 'peixe', 'frutos do mar'],
    'sem frutos do mar': ['camarão', 'peixe', 'salmão', 'atum', 'sardinha'],
    'sem açúcar': ['açúcar', 'mel', 'doce'],
    'diabética': ['açúcar', 'mel', 'doce', 'refrigerante']
  };

  let alimentosFiltrados = [...alimentos];
  
  restricoes.forEach(restricao => {
    const proibidos = alimentosProibidos[restricao] || [];
    alimentosFiltrados = alimentosFiltrados.filter(alimento => {
      return !proibidos.some(proibido => 
        alimento.toLowerCase().includes(proibido.toLowerCase())
      );
    });
  });

  return alimentosFiltrados;
};

const sugerirSubstitutos = (alimento, restricoes) => {
  const substitutos = {
    'leite': 'leite de amêndoas',
    'queijo': 'queijo vegano',
    'manteiga': 'óleo de coco',
    'iogurte': 'iogurte de coco',
    'creme de leite': 'creme de leite de coco',
    'farinha de trigo': 'farinha de arroz',
    'pão': 'pão sem glúten',
    'ovos': 'linhaça hidratada',
    'frango': 'cogumelos',
    'carne': 'proteína de soja'
  };

  if (restricoes.includes('sem lactose') || restricoes.includes('vegana')) {
    return substitutos[alimento.toLowerCase()] || alimento;
  }
  if (restricoes.includes('sem glúten')) {
    return substitutos[alimento.toLowerCase()] || alimento;
  }
  if (restricoes.includes('vegetariana') || restricoes.includes('vegana')) {
    return substitutos[alimento.toLowerCase()] || alimento;
  }

  return alimento;
};

const gerarReceitasComRestricoes = async (groqClient, alimentos, restricoes = [], usarMock = false) => {
  if (usarMock) {
    console.log('📝 Usando modo MOCK para receitas com restrições');
    
    // Filtrar alimentos que não podem ser usados
    let alimentosPermitidos = filtrarAlimentosPorRestricoes(alimentos, restricoes);
    
    if (alimentosPermitidos.length === 0) {
      return {
        mensagem: `Nenhum alimento compatível com as restrições: ${restricoes.join(', ')}`,
        receitas: []
      };
    }

    // Sugerir substitutos para alimentos incompatíveis
    const alimentosComSubstitutos = alimentos.map(alimento => {
      const permitido = alimentosPermitidos.includes(alimento);
      if (!permitido) {
        const substituto = sugerirSubstitutos(alimento, restricoes);
        return { original: alimento, uso: substituto, substituido: substituto !== alimento };
      }
      return { original: alimento, uso: alimento, substituido: false };
    });

    const restricoesTexto = restricoes.length > 0 ? ` (${restricoes.join(', ')})` : '';

    return {
      receitas: [
        {
          nome: `Bowl Nutritivo Especial${restricoesTexto}`,
          ingredientes: alimentosComSubstitutos.slice(0, 5).map(a => a.uso),
          modo_preparo: `1. Cozinhe ${alimentosComSubstitutos[0]?.uso || 'a base'} conforme instruções. 2. Em uma panela, refogue cebola e alho. 3. Adicione ${alimentosComSubstitutos[1]?.uso || 'os vegetais'} cortados em cubos. 4. Tempere com sal, pimenta e ervas frescas. 5. Misture tudo em uma tigela e sirva quente. 6. Finalize com um fio de azeite extra virgem.`,
          tempo_preparo: "35 minutos",
          porcoes: "4 porções",
          restricoes_atendidas: restricoes,
          dica_conservacao: "Armazene em recipiente hermético na geladeira por até 2 dias."
        },
        {
          nome: `Refogado Completo Saudável${restricoesTexto}`,
          ingredientes: alimentosComSubstitutos.slice(2, 6).map(a => a.uso),
          modo_preparo: `1. Pique todos os vegetais em pedaços médios. 2. Aqueça uma frigideira com óleo. 3. Refogue ${alimentosComSubstitutos[2]?.uso || 'os ingredientes'} começando pelos mais duros. 4. Acrescente temperos naturais como alecrim e tomilho. 5. Cozinhe em fogo médio até ficarem al dente. 6. Ajuste o sal e finalize com cheiro verde.`,
          tempo_preparo: "28 minutos",
          porcoes: "3 porções",
          restricoes_atendidas: restricoes,
          dica_conservacao: "Consuma no mesmo dia para preservar os nutrientes."
        },
        {
          nome: `Prato Rápido Equilibrado${restricoesTexto}`,
          ingredientes: alimentosComSubstitutos.slice(0, 4).map(a => a.uso),
          modo_preparo: `1. Prepare ${alimentosComSubstitutos[0]?.uso || 'a base principal'}. 2. Em outra panela, cozinhe ${alimentosComSubstitutos[1]?.uso || 'os complementos'}. 3. Tempere com especiarias naturais. 4. Combine tudo harmoniosamente no prato. 5. Adicione um toque de limão para realçar o sabor. 6. Sirva imediatamente enquanto está fresco.`,
          tempo_preparo: "22 minutos",
          porcoes: "2 porções",
          restricoes_atendidas: restricoes,
          dica_conservacao: "Se sobrar, reaqueça em banho-maria para manter a textura."
        }
      ]
    };
  }

  const restricoesTexto = restricoes.length > 0 
    ? `IMPORTANTE: As receitas devem ser adequadas para pessoas com: ${restricoes.join(', ')}.` 
    : '';

  const prompt = `Você é um chef especializado em aproveitamento de alimentos e dietas especiais.

Alimentos disponíveis (alguns podem estar próximos ao vencimento): ${alimentos.join(', ')}.

${restricoesTexto}

Crie 3 receitas criativas que:
1. Aproveitam ao máximo esses ingredientes
2. São fáceis de fazer
3. Evitam desperdício
4. Respeitam as restrições alimentares mencionadas

Responda APENAS em JSON válido:
{
  "receitas": [
    {
      "nome": "Nome da receita",
      "ingredientes": ["ingrediente 1", "ingrediente 2"],
      "modo_preparo": "Passo a passo detalhado",
      "tempo_preparo": "30 minutos",
      "porcoes": "4 porções",
      "dica_conservacao": "Como armazenar ou consumir rapidamente",
      "restricoes_atendidas": ["vegetariana", "sem lactose"]
    }
  ]
}`;

  try {
    const response = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Você é um chef especializado em dietas especiais e aproveitamento integral de alimentos. Sempre responda em JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000
    });

    const conteudo = response.choices[0].message.content;
    console.log('🤖 Receitas com restrições geradas pela Groq');
    
    const jsonMatch = conteudo.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return JSON.parse(conteudo);
  } catch (error) {
    console.error('❌ Erro ao chamar Groq:', error.message);
    console.log('⚠️  Usando modo MOCK automaticamente.');
    return gerarReceitasComRestricoes(groqClient, alimentos, restricoes, true);
  }
};

const gerarDicasEReceitasCompletas = async (groqClient, alimentos, restricoes = [], usarMock = false) => {
  if (usarMock) {
    console.log('📝 Usando modo MOCK para dicas completas');
    
    let alimentosPermitidos = filtrarAlimentosPorRestricoes(alimentos, restricoes);
    const alimentosProibidos = alimentos.filter(a => !alimentosPermitidos.includes(a));
    
    // Se houver restrições e alimentos incompatíveis, avisar
    let avisoSubstituicao = '';
    if (restricoes.length > 0 && alimentosProibidos.length > 0) {
      const substitutos = alimentosProibidos.map(a => {
        const sub = sugerirSubstitutos(a, restricoes);
        return sub !== a ? `${a} → ${sub}` : null;
      }).filter(s => s);
      
      if (substitutos.length > 0) {
        avisoSubstituicao = `⚠️ Devido às suas restrições (${restricoes.join(', ')}), sugerimos substituir: ${substitutos.join(', ')}`;
      }
    }

    // Usar alimentos originais da cesta
    const alimentosParaReceitas = alimentosPermitidos.length > 0 ? alimentosPermitidos : alimentos;

    return {
      dicas_nutricionais: [
        `Os alimentos ${alimentosParaReceitas.slice(0, 2).join(' e ')} são excelentes fontes de nutrientes e vitaminas essenciais.`,
        `Esta combinação é rica em fibras, antioxidantes e minerais importantes para sua saúde.`,
        restricoes.length > 0 
          ? `Todas as receitas respeitam suas restrições alimentares: ${restricoes.join(', ')}.${alimentosProibidos.length > 0 ? ' Alguns ingredientes foram excluídos por incompatibilidade.' : ''}`
          : `Aproveite estes ingredientes frescos para uma alimentação balanceada.`
      ],
      aviso: avisoSubstituicao,
      receitas: [
        {
          nome: `Combinação Especial com ${alimentosParaReceitas[0]}`,
          ingredientes: alimentosParaReceitas.slice(0, 4),
          modo_preparo: `1. Higienize bem ${alimentosParaReceitas[0]}. 2. Prepare uma base refogando cebola e alho. 3. Adicione ${alimentosParaReceitas[1]} cortado em pedaços médios. 4. Tempere com sal marinho, pimenta do reino e ervas frescas. 5. Cozinhe em fogo médio até atingir o ponto ideal. 6. Finalize com um fio de azeite extra virgem e sirva quente.`,
          tempo_preparo: "30 minutos",
          porcoes: "4 porções",
          restricoes_atendidas: restricoes
        },
        {
          nome: `Receita Nutritiva Balanceada`,
          ingredientes: alimentosParaReceitas.slice(1, 5),
          modo_preparo: `1. Corte todos os ingredientes uniformemente para cozimento homogêneo. 2. Aqueça uma panela antiaderente com um fio de óleo. 3. Refogue em camadas, começando pelos ingredientes mais firmes (como ${alimentosParaReceitas[1] || 'raízes'}). 4. Acrescente temperos naturais como alecrim, tomilho ou páprica. 5. Ajuste a consistência com água ou caldo vegetal se necessário. 6. Sirva quente acompanhado de grãos integrais ou salada verde.`,
          tempo_preparo: "25 minutos",
          porcoes: "3 porções",
          restricoes_atendidas: restricoes
        },
        {
          nome: `Prato Saudável Express`,
          ingredientes: alimentosParaReceitas.slice(0, 3),
          modo_preparo: `1. Prepare os ingredientes principais lavando e cortando adequadamente. 2. Monte o prato de forma harmoniosa, equilibrando cores e texturas. 3. Tempere levemente com sal, limão e especiarias para realçar os sabores naturais. 4. Adicione um toque especial com azeite extra virgem prensado a frio. 5. Decore com folhas frescas de manjericão ou salsinha. 6. Sirva na temperatura adequada para melhor apreciação.`,
          tempo_preparo: "18 minutos",
          porcoes: "2 porções",
          restricoes_atendidas: restricoes
        }
      ]
    };
  }

  const restricoesTexto = restricoes.length > 0 
    ? `IMPORTANTE: O usuário tem as seguintes restrições alimentares: ${restricoes.join(', ')}. Todas as receitas e dicas devem respeitar essas restrições.` 
    : '';

  const prompt = `Você é um nutricionista especializado em alimentação saudável e dietas especiais.

Alimentos disponíveis: ${alimentos.join(', ')}.

${restricoesTexto}

Forneça em JSON válido:
1. Dicas nutricionais sobre os benefícios desses alimentos (3 dicas)
2. Receitas práticas que aproveitam esses ingredientes (3 receitas)

{
  "dicas_nutricionais": ["dica1", "dica2", "dica3"],
  "receitas": [
    {
      "nome": "Nome da receita",
      "ingredientes": ["ingrediente 1", "ingrediente 2"],
      "modo_preparo": "Passo a passo detalhado",
      "tempo_preparo": "30 minutos",
      "porcoes": "4 porções",
      "restricoes_atendidas": ["vegetariana"]
    }
  ]
}`;

  try {
    const response = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Você é um nutricionista especializado. Sempre responda em JSON válido."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const conteudo = response.choices[0].message.content;
    console.log('🤖 Dicas completas geradas pela Groq');
    
    const jsonMatch = conteudo.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return JSON.parse(conteudo);
  } catch (error) {
    console.error('❌ Erro ao chamar Groq:', error.message);
    console.log('⚠️  Usando modo MOCK automaticamente.');
    return gerarDicasEReceitasCompletas(groqClient, alimentos, restricoes, true);
  }
};

const openaiRoutes = async (req, res, groqClient) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;
  
  const usarMock = parsedUrl.query.mock === 'true';

  // Buscar dicas para uma publicação específica (CORRIGIDO)
  if (path.match(/\/api\/publicacoes\/\d+\/dicas$/) && method === 'GET') {
    const id = parseInt(path.split('/')[3]);
    const publicacao = publicacoes.find(p => p.id === id);

    if (!publicacao) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: 'Publicação não encontrada' }));
    }

    try {
      // Usar a função correta: gerarDicasMock para GET simples
      const dicas = usarMock 
        ? gerarDicasMock(publicacao.alimentos)
        : await gerarDicasEReceitasCompletas(groqClient, publicacao.alimentos, [], false);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        publicacao: {
          id: publicacao.id,
          titulo: publicacao.titulo,
          alimentos: publicacao.alimentos
        },
        ...dicas,
        modo: usarMock ? 'mock' : 'groq'
      }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ 
        erro: 'Erro ao gerar dicas',
        detalhes: error.message 
      }));
    }
  }

  // Listar todas as publicações
  if (path === '/api/publicacoes' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(publicacoes));
  }

  // Novo endpoint: Receitas para alimentos próximos ao vencimento
  if (path === '/api/receitas/salvar-alimentos' && method === 'POST') {
    const body = await parseBody(req);
    const alimentos = body.alimentos || [];
    const restricoes = body.restricoes || [];

    if (alimentos.length === 0) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: 'Lista de alimentos vazia' }));
    }

    try {
      const resultado = await gerarReceitasComRestricoes(groqClient, alimentos, restricoes, usarMock);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        alimentos_utilizados: alimentos,
        restricoes_aplicadas: restricoes,
        ...resultado,
        modo: usarMock ? 'mock' : 'groq'
      }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ 
        erro: 'Erro ao gerar receitas',
        detalhes: error.message 
      }));
    }
  }

  // Endpoint para receitas de uma publicação com restrições (ATUALIZADO)
  if (path.match(/\/api\/publicacoes\/\d+\/receitas-especiais$/) && method === 'POST') {
    const id = parseInt(path.split('/')[3]);
    const body = await parseBody(req);
    const restricoes = body.restricoes || [];
    
    const publicacao = publicacoes.find(p => p.id === id);

    if (!publicacao) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ erro: 'Publicação não encontrada' }));
    }

    try {
      const resultado = await gerarDicasEReceitasCompletas(
        groqClient, 
        publicacao.alimentos, 
        restricoes, 
        usarMock
      );
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({
        publicacao: {
          id: publicacao.id,
          titulo: publicacao.titulo,
          alimentos: publicacao.alimentos
        },
        restricoes_aplicadas: restricoes,
        ...resultado,
        modo: usarMock ? 'mock' : 'groq'
      }));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ 
        erro: 'Erro ao gerar receitas',
        detalhes: error.message 
      }));
    }
  }

  return null;
};

// Helper para parsear body (adicionar se não existir)
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

module.exports = openaiRoutes;
