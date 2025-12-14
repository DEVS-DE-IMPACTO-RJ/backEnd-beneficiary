# 🍎 Back-end Beneficiário - Sistema de Doação de Cestas Básicas

Backend o do beneficiário, uma plataforma para conectar estabelecimentos que doam cestas básicas com pessoas que precisam. Inclui integração com IA (Groq) para sugestões nutricionais personalizadas.

---

## 📋 Índice

- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Endpoints da API](#endpoints-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Exemplos de Uso](#exemplos-de-uso)

---

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **HTTP nativo** - Sem frameworks (vanilla Node.js)
- **Groq AI** - IA para dicas nutricionais (gratuita)
- **dotenv** - Gerenciamento de variáveis de ambiente

---

## 📦 Instalação

```bash
# Clonar o repositório
git clone <seu-repositorio>
cd Maria-Back

# Instalar dependências
npm install

# Executar o servidor
npm start

# Ou em modo desenvolvimento (auto-reload)
npm run dev
```

---

## ⚙️ Configuração

### 1. Criar arquivo `.env` na raiz do projeto:

```env
GROQ_API_KEY=sua-chave-groq-aqui
PORT=3000
```

### 2. Obter API Key do Groq (Gratuita):

1. Acesse: https://console.groq.com/
2. Crie uma conta
3. Vá em "API Keys"
4. Crie uma nova chave
5. Cole no arquivo `.env`

---

## 🌐 Endpoints da API

### 👤 **Gerenciamento de Perfil**

#### 1. Criar Perfil
```http
POST /api/perfil
Content-Type: application/json

{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "telefone": "(11) 98765-4321",
  "endereco": "Rua das Flores, 123"
}
```

**Resposta (201):**
```json
{
  "mensagem": "Perfil criado com sucesso!",
  "perfil": {
    "id": 1,
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "telefone": "(11) 98765-4321",
    "endereco": "Rua das Flores, 123",
    "criadoEm": "2024-01-20T10:30:00.000Z"
  }
}
```

#### 2. Ver Perfil

**📋 O que faz:**
Busca e retorna os dados de um perfil específico pelo ID.

**📥 Requisição:**
```http
GET /api/perfil/1
```

**📤 Resposta de Sucesso (200):**
```json
{
  "perfil": {
    "id": 1,
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "telefone": "(11) 98765-4321",
    "endereco": "Rua das Flores, 123",
    "criadoEm": "2024-01-20T10:30:00.000Z",
    "atualizadoEm": "2024-01-20T10:30:00.000Z"
  }
}
```

**❌ Resposta de Erro (404):**
```json
{
  "erro": "Perfil não encontrado"
}
```

**💡 Exemplo de Uso:**
```javascript
fetch('http://localhost:3000/api/perfil/1')
  .then(response => response.json())
  .then(data => console.log('Perfil:', data.perfil))
  .catch(error => console.error('Erro:', error));
```

---

#### 3. Atualizar Perfil

**📋 O que faz:**
Atualiza informações de um perfil existente. Você pode atualizar apenas os campos que desejar (atualização parcial).

**🎯 Campos atualizáveis:**
- `nome`
- `email`
- `telefone`
- `endereco`

**📥 Requisição:**
```http
PUT /api/perfil/1
Content-Type: application/json

{
  "telefone": "(11) 99999-8888",
  "endereco": "Rua Nova, 456"
}
```

**📤 Resposta de Sucesso (200):**
```json
{
  "mensagem": "Perfil atualizado com sucesso!",
  "perfil": {
    "id": 1,
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "telefone": "(11) 99999-8888",
    "endereco": "Rua Nova, 456",
    "criadoEm": "2024-01-20T10:30:00.000Z",
    "atualizadoEm": "2024-01-21T15:45:00.000Z"
  }
}
```

**❌ Resposta de Erro (404):**
```json
{
  "erro": "Perfil não encontrado"
}
```

**💡 Exemplo de Uso:**
```javascript
fetch('http://localhost:3000/api/perfil/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    telefone: '(11) 99999-8888',
    endereco: 'Rua Nova, 456'
  })
})
.then(response => response.json())
.then(data => console.log('Atualizado:', data))
.catch(error => console.error('Erro:', error));
```

---

#### 4. Deletar Perfil

**📋 O que faz:**
Remove permanentemente um perfil do sistema. **Esta ação não pode ser desfeita!**

**⚠️ Importante:**
- Remove todos os dados do perfil
- Remove também coletas e interesses associados
- Operação irreversível

**📥 Requisição:**
```http
DELETE /api/perfil/1
```

**📤 Resposta de Sucesso (200):**
```json
{
  "mensagem": "Perfil deletado com sucesso!",
  "perfilDeletado": {
    "id": 1,
    "nome": "Maria Silva"
  }
}
```

**❌ Resposta de Erro (404):**
```json
{
  "erro": "Perfil não encontrado"
}
```

**💡 Exemplo de Uso:**
```javascript
if (confirm('Tem certeza que deseja deletar seu perfil? Esta ação não pode ser desfeita!')) {
  fetch('http://localhost:3000/api/perfil/1', {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    console.log('Perfil deletado:', data);
    // Redirecionar para página inicial
  })
  .catch(error => console.error('Erro:', error));
}
```

---

### 🛒 **Coletas de Cestas**

#### 5. Agendar Coleta
```http
POST /api/minhas-coletas
Content-Type: application/json

{
  "usuarioId": 1,
  "estabelecimento": "Padaria Pão Nosso",
  "endereco": "Rua das Acácias, 456",
  "data": "2024-01-25",
  "horario": "15:00",
  "tipoCesta": "básica",
  "observacoes": "Prefiro cesta com arroz integral"
}
```

**Resposta (201):**
```json
{
  "mensagem": "Coleta agendada com sucesso!",
  "coleta": {
    "id": 1,
    "usuarioId": 1,
    "estabelecimento": "Padaria Pão Nosso",
    "data": "2024-01-25",
    "horario": "15:00",
    "status": "agendada",
    "criadoEm": "2024-01-20T10:30:00.000Z"
  }
}
```

#### 6. Ver Minhas Coletas

**📋 O que faz:**
Retorna lista de todas as coletas agendadas por um usuário específico.

**🎯 Informações retornadas:**
- Histórico completo de coletas
- Status atual (agendada, concluída, cancelada)
- Detalhes do estabelecimento e horário

**📥 Requisição:**
```http
GET /api/minhas-coletas/1
```

**📤 Resposta de Sucesso (200):**
```json
{
  "coletas": [
    {
      "id": 1,
      "usuarioId": 1,
      "estabelecimento": "Padaria Pão Nosso",
      "endereco": "Rua das Acácias, 456",
      "data": "2024-01-25",
      "horario": "15:00",
      "tipoCesta": "básica",
      "status": "agendada",
      "observacoes": "Prefiro cesta com arroz integral",
      "criadoEm": "2024-01-20T10:30:00.000Z"
    },
    {
      "id": 2,
      "usuarioId": 1,
      "estabelecimento": "Mercado Bom Preço",
      "endereco": "Av. Principal, 789",
      "data": "2024-01-28",
      "horario": "10:00",
      "tipoCesta": "completa",
      "status": "agendada",
      "observacoes": null,
      "criadoEm": "2024-01-21T14:20:00.000Z"
    }
  ],
  "total": 2
}
```

**📤 Resposta Vazia (200):**
```json
{
  "coletas": [],
  "total": 0,
  "mensagem": "Nenhuma coleta encontrada"
}
```

**💡 Exemplo de Uso:**
```javascript
const usuarioId = 1;
fetch(`http://localhost:3000/api/minhas-coletas/${usuarioId}`)
  .then(response => response.json())
  .then(data => {
    console.log(`Total de coletas: ${data.total}`);
    data.coletas.forEach(coleta => {
      console.log(`${coleta.estabelecimento} - ${coleta.data} às ${coleta.horario}`);
    });
  })
  .catch(error => console.error('Erro:', error));
```

---

#### 7. Cancelar Coleta

**📋 O que faz:**
Cancela uma coleta previamente agendada. O estabelecimento será notificado do cancelamento.

**⚠️ Importante:**
- Só é possível cancelar coletas com status "agendada"
- Recomenda-se cancelar com pelo menos 24h de antecedência
- O estabelecimento pode disponibilizar a vaga para outro beneficiário

**📥 Requisição:**
```http
DELETE /api/minhas-coletas/cancelar/1
```

**📤 Resposta de Sucesso (200):**
```json
{
  "mensagem": "Coleta cancelada com sucesso!",
  "coletaCancelada": {
    "id": 1,
    "estabelecimento": "Padaria Pão Nosso",
    "data": "2024-01-25",
    "horario": "15:00",
    "statusAnterior": "agendada",
    "statusAtual": "cancelada",
    "canceladoEm": "2024-01-22T09:15:00.000Z"
  }
}
```

**❌ Resposta de Erro (404):**
```json
{
  "erro": "Coleta não encontrada"
}
```

**❌ Resposta de Erro (400):**
```json
{
  "erro": "Não é possível cancelar esta coleta",
  "motivo": "A coleta já foi concluída ou cancelada anteriormente"
}
```

**💡 Exemplo de Uso:**
```javascript
const coletaId = 1;

if (confirm('Deseja realmente cancelar esta coleta?')) {
  fetch(`http://localhost:3000/api/minhas-coletas/cancelar/${coletaId}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    console.log('Coleta cancelada:', data);
    alert(data.mensagem);
    // Atualizar lista de coletas
  })
  .catch(error => console.error('Erro:', error));
}
```

---

### 📢 **Publicações**

#### 8. Listar Publicações
```http
GET /api/publicacoes
```

**Resposta (200):**
```json
[
  {
    "id": 1,
    "titulo": "Cesta Básica Completa",
    "alimentos": ["leite", "ovos", "farinha de trigo", "tomate", "cebola", "batata", "cenoura", "arroz", "feijão"],
    "peso": "8kg",
    "estabelecimento": "Padaria Pão Nosso",
    "endereco": "Rua das Acácias, 456"
  }
]
```

#### 9. Demonstrar Interesse

**📋 O que faz:**
Registra o interesse do usuário em uma publicação específica de cesta básica. O estabelecimento poderá ver quantas pessoas demonstraram interesse.

**🎯 Quando usar:**
- Usuário encontrou uma cesta que deseja receber
- Quer ser notificado sobre disponibilidade
- Estabelecimento pode priorizar quem demonstrou interesse

**📥 Requisição:**
```http
POST /api/publicacoes/abc-123/interesse
Content-Type: application/json

{
  "usuarioId": 1
}
```

**📤 Resposta de Sucesso (201):**
```json
{
  "mensagem": "Interesse registrado com sucesso!",
  "interesse": {
    "id": 10,
    "usuarioId": 1,
    "publicacaoId": "abc-123",
    "publicacaoTitulo": "Cesta Básica Completa",
    "estabelecimento": "Padaria Pão Nosso",
    "statusPublicacao": "disponível",
    "criadoEm": "2024-01-22T11:30:00.000Z"
  },
  "totalInteressados": 5
}
```

**❌ Resposta de Erro (404):**
```json
{
  "erro": "Publicação não encontrada"
}
```

**❌ Resposta de Erro (409):**
```json
{
  "erro": "Você já demonstrou interesse nesta publicação",
  "interesseExistente": {
    "id": 10,
    "criadoEm": "2024-01-22T11:30:00.000Z"
  }
}
```

**💡 Exemplo de Uso:**
```javascript
const publicacaoId = 'abc-123';
const usuarioId = 1;

fetch(`http://localhost:3000/api/publicacoes/${publicacaoId}/interesse`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ usuarioId })
})
.then(response => response.json())
.then(data => {
  console.log(data.mensagem);
  console.log(`Total de interessados: ${data.totalInteressados}`);
  // Mostrar botão "Interesse Registrado"
})
.catch(error => console.error('Erro:', error));
```

---

#### 10. Ver Meus Interesses

**📋 O que faz:**
Retorna lista completa de todas as publicações em que o usuário demonstrou interesse, incluindo status atual de cada publicação.

**🎯 Informações retornadas:**
- Publicações com interesse ativo
- Status das publicações (disponível, reservada, encerrada)
- Dados do estabelecimento
- Data do interesse

**📥 Requisição:**
```http
GET /api/minhas-reacoes/1
```

**📤 Resposta de Sucesso (200):**
```json
{
  "interesses": [
    {
      "id": 10,
      "usuarioId": 1,
      "publicacao": {
        "id": "abc-123",
        "titulo": "Cesta Básica Completa",
        "alimentos": ["arroz", "feijão", "óleo", "açúcar", "café", "leite"],
        "peso": "8kg",
        "estabelecimento": "Padaria Pão Nosso",
        "endereco": "Rua das Acácias, 456",
        "status": "disponível"
      },
      "criadoEm": "2024-01-22T11:30:00.000Z"
    },
    {
      "id": 15,
      "usuarioId": 1,
      "publicacao": {
        "id": "def-456",
        "titulo": "Cesta de Frutas e Verduras",
        "alimentos": ["banana", "maçã", "tomate", "alface", "cenoura"],
        "peso": "5kg",
        "estabelecimento": "Hortifruti Silva",
        "endereco": "Av. Central, 789",
        "status": "reservada"
      },
      "criadoEm": "2024-01-23T09:15:00.000Z"
    }
  ],
  "total": 2,
  "estatisticas": {
    "disponiveis": 1,
    "reservadas": 1,
    "encerradas": 0
  }
}
```

**📤 Resposta Vazia (200):**
```json
{
  "interesses": [],
  "total": 0,
  "mensagem": "Você ainda não demonstrou interesse em nenhuma publicação"
}
```

**💡 Exemplo de Uso:**
```javascript
const usuarioId = 1;

fetch(`http://localhost:3000/api/minhas-reacoes/${usuarioId}`)
  .then(response => response.json())
  .then(data => {
    console.log(`Total de interesses: ${data.total}`);
    console.log(`Disponíveis: ${data.estatisticas.disponiveis}`);
    
    data.interesses.forEach(interesse => {
      console.log(`📦 ${interesse.publicacao.titulo}`);
      console.log(`   ${interesse.publicacao.estabelecimento}`);
      console.log(`   Status: ${interesse.publicacao.status}`);
    });
  })
  .catch(error => console.error('Erro:', error));
```

---

### 🤖 **IA - Dicas Nutricionais (Groq)**

#### 11. Dicas da Cesta (Simples)

**📋 O que faz:**
Gera automaticamente dicas nutricionais e receitas baseadas nos alimentos de uma publicação específica, **sem considerar restrições alimentares**.

**🎯 Quando usar:**
- Usuário quer ideias de como usar os alimentos
- Busca valor nutricional dos alimentos
- Quer receitas simples e rápidas
- Não tem restrições alimentares

**📥 Requisição:**
```http
GET /api/publicacoes/abc-123/dicas?mock=true
```

**Parâmetros Query:**
- `?mock=true` - Usa respostas simuladas (grátis, não consome créditos)
- Sem parâmetro - Usa IA real Groq (consome créditos)

**📤 Resposta Completa (200):**
```json
{
  "publicacao": {
    "id": "abc-123",
    "titulo": "Cesta Básica Completa",
    "alimentos": ["leite", "ovos", "farinha de trigo", "tomate", "cebola", "arroz", "feijão"]
  },
  "dicas_nutricionais": [
    "Os alimentos leite e ovos são ricos em vitaminas do complexo B e proteínas de alto valor biológico, essenciais para o desenvolvimento muscular",
    "Esta combinação fornece proteínas, carboidratos complexos e fibras importantes para uma dieta equilibrada e saciante",
    "Consuma estes alimentos frescos e armazenados corretamente para aproveitar ao máximo seus benefícios nutricionais e evitar desperdício"
  ],
  "receitas": [
    {
      "nome": "Omelete Completa",
      "ingredientes": ["ovos", "leite", "tomate", "cebola"],
      "modo_preparo": "1. Bata os ovos com o leite. 2. Pique tomate e cebola finamente. 3. Aqueça uma frigideira antiaderente. 4. Despeje os ovos batidos. 5. Adicione tomate e cebola. 6. Cozinhe em fogo baixo até firmar. 7. Sirva quente.",
      "tempo_preparo": "20 minutos",
      "porcoes": "2 porções",
      "valor_nutricional": "Alto em proteínas",
      "dificuldade": "Fácil"
    },
    {
      "nome": "Arroz com Feijão Tradicional",
      "ingredientes": ["arroz", "feijão", "cebola", "tomate"],
      "modo_preparo": "1. Cozinhe o feijão em panela de pressão por 30 minutos. 2. Refogue cebola picada. 3. Adicione tomate e deixe cozinhar. 4. Cozinhe o arroz separadamente. 5. Tempere o feijão com o refogado. 6. Sirva arroz e feijão juntos.",
      "tempo_preparo": "45 minutos",
      "porcoes": "4 porções",
      "valor_nutricional": "Proteína completa, fibras",
      "dificuldade": "Fácil"
    },
    {
      "nome": "Panqueca Simples",
      "ingredientes": ["farinha de trigo", "ovos", "leite"],
      "modo_preparo": "1. Misture farinha, ovos e leite até formar massa homogênea. 2. Deixe descansar por 10 minutos. 3. Aqueça frigideira antiaderente. 4. Despeje uma concha de massa. 5. Quando dourar embaixo, vire. 6. Sirva com recheio doce ou salgado.",
      "tempo_preparo": "30 minutos",
      "porcoes": "6 panquecas",
      "valor_nutricional": "Carboidratos e proteínas",
      "dificuldade": "Médio"
    }
  ],
  "dicas_conservacao": [
    "Mantenha ovos refrigerados e consuma em até 30 dias",
    "Leite deve ser mantido na geladeira após aberto (consumir em 3 dias)",
    "Farinha deve ser armazenada em local seco e arejado",
    "Arroz e feijão podem ser armazenados em temperatura ambiente em recipiente fechado"
  ],
  "modo": "mock"
}
```

**❌ Resposta de Erro (404):**
```json
{
  "erro": "Publicação não encontrada"
}
```

**🔄 Fluxo Visual:**
```
1. 👤 Usuário → Seleciona publicação "Cesta Básica Completa"
         ↓
2. 📡 Frontend → GET /api/publicacoes/abc-123/dicas?mock=true
         ↓
3. ⚙️ Backend → Busca alimentos da cesta
         ↓
4. 🤖 IA/Mock → Analisa alimentos e gera dicas + receitas
         ↓
5. 📡 Backend → Retorna dicas nutricionais + 3 receitas
         ↓
6. 👤 Usuário → Visualiza dicas e escolhe receita ✅
```

**💡 Exemplo de Uso:**
```javascript
const publicacaoId = 'abc-123';
const usarMock = true; // true = não gasta créditos

fetch(`http://localhost:3000/api/publicacoes/${publicacaoId}/dicas?mock=${usarMock}`)
  .then(response => response.json())
  .then(data => {
    console.log('📦 Cesta:', data.publicacao.titulo);
    console.log('🥗 Alimentos:', data.publicacao.alimentos.join(', '));
    
    console.log('\n💡 Dicas Nutricionais:');
    data.dicas_nutricionais.forEach((dica, i) => {
      console.log(`${i + 1}. ${dica}`);
    });
    
    console.log('\n📖 Receitas:');
    data.receitas.forEach(receita => {
      console.log(`\n${receita.nome}`);
      console.log(`⏱️ ${receita.tempo_preparo} | 🍽️ ${receita.porcoes}`);
      console.log(`📝 Ingredientes: ${receita.ingredientes.join(', ')}`);
    });
  })
  .catch(error => console.error('Erro:', error));
```

**⚠️ Diferença entre Mock e IA Real:**

| Aspecto | Mock (`?mock=true`) | IA Real (sem parâmetro) |
|---------|---------------------|-------------------------|
| **Custo** | Gratuito | Consome créditos Groq |
| **Velocidade** | Instantâneo | 2-5 segundos |
| **Qualidade** | Genérica | Personalizada e criativa |
| **Uso ideal** | Testes e desenvolvimento | Produção |

---

#### 12. Dicas com Restrições Alimentares

**📋 O que faz este endpoint?**
Busca uma publicação específica (cesta básica) e gera receitas personalizadas que respeitam as restrições alimentares do usuário. O sistema:
- ✅ Remove alimentos proibidos automaticamente
- ✅ Sugere substitutos saudáveis (ex: leite → leite de amêndoas)
- ✅ Cria receitas adaptadas às necessidades especiais
- ✅ Garante que as receitas sejam seguras para consumo

**🎯 Quando usar:**
- Usuário tem intolerância (lactose, glúten)
- Segue dieta específica (vegetariana, vegana, diabética)
- Tem alergias alimentares
- Busca receitas adaptadas às suas restrições

---

**📥 Requisição:**
```http
POST /api/publicacoes/{id}/receitas-especiais?mock=true
Content-Type: application/json

{
  "restricoes": ["sem lactose", "vegetariana"]
}
```

**Parâmetros:**
- `{id}` - ID da publicação (cesta básica)
- `restricoes` - Array com as restrições escolhidas pelo usuário
- `?mock=true` - (Opcional) Usa modo simulado para testes

---

**🍴 Restrições Disponíveis:**

| Restrição | Remove/Substitui |
|-----------|------------------|
| `vegetariana` | Carnes, frango, peixes, frutos do mar |
| `vegana` | Todos os produtos de origem animal (leite, ovos, mel, carnes) |
| `sem lactose` | Leite, queijo, manteiga, iogurte, creme de leite |
| `sem glúten` | Farinha de trigo, pão, macarrão, biscoito |
| `sem açúcar` | Açúcar, mel, doces, refrigerantes |
| `low carb` | Alimentos ricos em carboidratos |
| `diabética` | Açúcar, mel, doces (similar a "sem açúcar") |
| `sem frutos do mar` | Camarão, peixe, salmão, atum, sardinha |
| `sem oleaginosas` | Nozes, amendoim, castanhas |

---

**📤 Resposta Completa (Exemplo):**
```json
{
  "publicacao": {
    "id": "abc-123",
    "titulo": "Cesta Básica Completa",
    "alimentos": ["leite", "ovos", "farinha de trigo", "tomate", "cebola", "batata"]
  },
  "restricoes_aplicadas": ["sem lactose", "vegetariana"],
  "dicas_nutricionais": [
    "Com as restrições aplicadas, os alimentos ovos, tomate, cebola e batata são excelentes fontes de proteínas e vitaminas",
    "Substitua o leite por leite de amêndoas ou soja para manter o cálcio na dieta"
  ],
  "receitas": [
    {
      "nome": "Bowl Nutritivo Especial (sem lactose, vegetariana)",
      "ingredientes": ["ovos", "tomate", "cebola", "batata", "azeite"],
      "modo_preparo": "1. Cozinhe as batatas em cubos. 2. Refogue a cebola e o tomate. 3. Prepare os ovos mexidos com azeite (sem manteiga). 4. Monte o bowl com todos os ingredientes. 5. Tempere com sal, pimenta e ervas.",
      "tempo_preparo": "35 minutos",
      "porcoes": "4 porções",
      "restricoes_atendidas": ["sem lactose", "vegetariana"],
      "dica_conservacao": "Armazene em recipiente hermético na geladeira por até 2 dias",
      "dica_substituicao": "Leite foi substituído por preparo sem laticínios. Farinha de trigo foi removida por conter glúten"
    },
    {
      "nome": "Refogado Completo Saudável (sem lactose, vegetariana)",
      "ingredientes": ["tomate", "cebola", "batata", "cenoura"],
      "modo_preparo": "1. Corte todos os vegetais em cubos. 2. Refogue começando pela cebola. 3. Adicione batata e cenoura. 4. Por último, adicione o tomate. 5. Tempere e sirva quente.",
      "tempo_preparo": "28 minutos",
      "porcoes": "3 porções",
      "restricoes_atendidas": ["sem lactose", "vegetariana"],
      "dica_conservacao": "Consuma no mesmo dia para preservar nutrientes"
    }
  ],
  "alimentos_removidos": [
    {
      "alimento": "leite",
      "motivo": "Contém lactose",
      "substituto_sugerido": "leite de amêndoas ou leite de soja"
    }
  ],
  "modo": "mock"
}
```

---

**🔄 Fluxo Visual:**
```
1. 👤 Usuário → Escolhe publicação ID "abc-123"
                 ↓
2. 👤 Usuário → Seleciona restrições ["sem lactose", "vegetariana"]
                 ↓
3. 📡 Frontend → POST /api/publicacoes/abc-123/receitas-especiais
                 Body: { "restricoes": ["sem lactose", "vegetariana"] }
                 ↓
4. ⚙️ Backend → Busca alimentos da cesta: [leite, ovos, tomate, batata]
                 ↓
5. ⚙️ Backend → Filtra alimentos proibidos: Remove "leite" (lactose)
                 ↓
6. ⚙️ Backend → Sugere substitutos: "leite" → "leite de amêndoas"
                 ↓
7. 🤖 IA/Mock → Gera receitas com alimentos permitidos + substitutos
                 ↓
8. 📡 Backend → Retorna receitas adaptadas + dicas nutricionais
                 ↓
9. 👤 Usuário → Recebe receitas seguras para suas restrições ✅
```

---

**💡 Exemplo Prático de Uso (JavaScript):**
```javascript
// Cenário: Usuário intolerante à lactose e vegetariano
// quer receitas da cesta ID "abc-123"

const publicacaoId = "abc-123";
const minhasRestricoes = ["sem lactose", "vegetariana"];

fetch(`http://localhost:3000/api/publicacoes/${publicacaoId}/receitas-especiais?mock=true`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ restricoes: minhasRestricoes })
})
.then(response => response.json())
.then(data => {
  console.log('✅ Receitas adaptadas:', data.receitas);
  console.log('🚫 Alimentos removidos:', data.alimentos_removidos);
  console.log('📋 Restrições aplicadas:', data.restricoes_aplicadas);
  
  // Exibir receitas para o usuário
  data.receitas.forEach(receita => {
    console.log(`\n📖 ${receita.nome}`);
    console.log(`⏱️ ${receita.tempo_preparo}`);
    console.log(`🍽️ ${receita.porcoes}`);
    console.log(`✅ Seguro para: ${receita.restricoes_atendidas.join(', ')}`);
  });
});
```

---

**⚠️ Importante:**
- O sistema **remove automaticamente** alimentos incompatíveis
- Sempre verifica se há alimentos suficientes após filtrar
- Se todos os alimentos forem incompatíveis, retorna mensagem apropriada
- Modo `?mock=true` não consome créditos da IA (ideal para testes)

---

### � **Modelos JSON para Copiar e Usar**

#### **Modelo 1: Usuário Vegetariano sem Lactose**
```json
// REQUISIÇÃO
POST http://localhost:3000/api/publicacoes/abc-123/receitas-especiais?mock=true
Content-Type: application/json

{
  "restricoes": ["sem lactose", "vegetariana"]
}

// RESPOSTA ESPERADA
{
  "publicacao": {
    "id": "abc-123",
    "titulo": "Cesta Básica Completa",
    "alimentos": ["leite", "ovos", "farinha de trigo", "tomate", "cebola", "batata", "cenoura", "arroz", "feijão"]
  },
  "restricoes_aplicadas": ["sem lactose", "vegetariana"],
  "dicas_nutricionais": [
    "Com as restrições aplicadas, os alimentos ovos, tomate, cebola, batata, cenoura, arroz e feijão formam uma combinação nutritiva",
    "Substitua o leite por leite vegetal (amêndoas, soja ou aveia) para manter o cálcio"
  ],
  "receitas": [
    {
      "nome": "Bowl Nutritivo Especial (sem lactose, vegetariana)",
      "ingredientes": ["ovos", "tomate", "cebola", "batata", "azeite"],
      "modo_preparo": "1. Cozinhe as batatas em cubos até ficarem macias. 2. Refogue a cebola e o tomate em azeite. 3. Prepare os ovos mexidos sem manteiga. 4. Monte o bowl com todos os ingredientes. 5. Tempere com sal, pimenta e ervas frescas.",
      "tempo_preparo": "35 minutos",
      "porcoes": "4 porções",
      "restricoes_atendidas": ["sem lactose", "vegetariana"],
      "dica_conservacao": "Armazene em recipiente hermético na geladeira por até 2 dias"
    }
  ],
  "alimentos_removidos": [
    {
      "alimento": "leite",
      "motivo": "Contém lactose",
      "substituto_sugerido": "leite de amêndoas ou leite de soja"
    }
  ],
  "modo": "mock"
}
```

#### **Modelo 2: Usuário Vegano**
```json
// REQUISIÇÃO
POST http://localhost:3000/api/publicacoes/def-456/receitas-especiais?mock=true
Content-Type: application/json

{
  "restricoes": ["vegana"]
}

// RESPOSTA ESPERADA
{
  "publicacao": {
    "id": "def-456",
    "titulo": "Cesta Variada",
    "alimentos": ["leite", "ovos", "queijo", "tomate", "cebola", "batata", "cenoura", "arroz", "feijão", "maçã"]
  },
  "restricoes_aplicadas": ["vegana"],
  "dicas_nutricionais": [
    "Dieta vegana bem planejada com tomate, cebola, batata, cenoura, arroz, feijão e maçã fornece fibras e vitaminas essenciais",
    "Combine arroz com feijão para obter proteína completa de origem vegetal"
  ],
  "receitas": [
    {
      "nome": "Bowl Vegano Completo",
      "ingredientes": ["arroz", "feijão", "tomate", "cebola", "batata", "cenoura"],
      "modo_preparo": "1. Cozinhe o arroz e o feijão separadamente. 2. Refogue tomate, cebola, batata e cenoura. 3. Monte o bowl com arroz como base. 4. Adicione feijão e vegetais refogados. 5. Tempere com especiarias naturais.",
      "tempo_preparo": "40 minutos",
      "porcoes": "4 porções",
      "restricoes_atendidas": ["vegana"],
      "dica_conservacao": "Pode ser congelado em porções individuais"
    }
  ],
  "alimentos_removidos": [
    {
      "alimento": "leite",
      "motivo": "Produto de origem animal",
      "substituto_sugerido": "leite de coco ou soja"
    },
    {
      "alimento": "ovos",
      "motivo": "Produto de origem animal",
      "substituto_sugerido": "linhaça hidratada ou tofu"
    },
    {
      "alimento": "queijo",
      "motivo": "Produto de origem animal",
      "substituto_sugerido": "queijo vegano de castanhas"
    }
  ],
  "modo": "mock"
}
```

#### **Modelo 3: Usuário Diabético sem Glúten**
```json
// REQUISIÇÃO
POST http://localhost:3000/api/publicacoes/ghi-789/receitas-especiais?mock=true
Content-Type: application/json

{
  "restricoes": ["diabética", "sem glúten"]
}

// RESPOSTA ESPERADA
{
  "publicacao": {
    "id": "ghi-789",
    "titulo": "Cesta Saudável",
    "alimentos": ["farinha de trigo", "pão", "açúcar", "mel", "arroz", "feijão", "frango", "tomate", "cebola"]
  },
  "restricoes_aplicadas": ["diabética", "sem glúten"],
  "dicas_nutricionais": [
    "Para dieta diabética, priorize alimentos com baixo índice glicêmico como frango, feijão e vegetais",
    "Arroz integral (sem glúten) é melhor opção que arroz branco para controle glicêmico"
  ],
  "receitas": [
    {
      "nome": "Prato Diabético sem Glúten",
      "ingredientes": ["frango", "arroz", "feijão", "tomate", "cebola"],
      "modo_preparo": "1. Tempere e grelhe o frango em cubos. 2. Cozinhe o arroz (prefira integral). 3. Prepare o feijão sem açúcar. 4. Refogue tomate e cebola. 5. Monte o prato equilibrando proteína (frango), carboidrato (arroz) e fibras (feijão).",
      "tempo_preparo": "45 minutos",
      "porcoes": "3 porções",
      "restricoes_atendidas": ["diabética", "sem glúten"],
      "dica_conservacao": "Porções individuais facilitam controle de quantidade"
    }
  ],
  "alimentos_removidos": [
    {
      "alimento": "farinha de trigo",
      "motivo": "Contém glúten",
      "substituto_sugerido": "farinha de arroz ou tapioca"
    },
    {
      "alimento": "pão",
      "motivo": "Contém glúten",
      "substituto_sugerido": "pão sem glúten ou tapioca"
    },
    {
      "alimento": "açúcar",
      "motivo": "Não recomendado para diabéticos",
      "substituto_sugerido": "adoçante natural (stevia)"
    },
    {
      "alimento": "mel",
      "motivo": "Alto índice glicêmico",
      "substituto_sugerido": "adoçante natural em pequenas quantidades"
    }
  ],
  "modo": "mock"
}
```

#### **Modelo 4: Múltiplas Restrições (Mais Complexo)**
```json
// REQUISIÇÃO
POST http://localhost:3000/api/publicacoes/jkl-012/receitas-especiais?mock=true
Content-Type: application/json

{
  "restricoes": ["vegana", "sem glúten", "sem açúcar"]
}

// RESPOSTA ESPERADA
{
  "publicacao": {
    "id": "jkl-012",
    "titulo": "Cesta Diversificada",
    "alimentos": ["leite", "ovos", "farinha de trigo", "açúcar", "arroz", "feijão", "batata", "cenoura", "tomate", "banana", "maçã"]
  },
  "restricoes_aplicadas": ["vegana", "sem glúten", "sem açúcar"],
  "dicas_nutricionais": [
    "Dieta vegana, sem glúten e sem açúcar requer planejamento cuidadoso para nutrientes completos",
    "Combine arroz com feijão para proteína completa. Frutas naturais fornecem doçura sem açúcar adicionado"
  ],
  "receitas": [
    {
      "nome": "Bowl Vegano Sem Glúten e Açúcar",
      "ingredientes": ["arroz", "feijão", "batata", "cenoura", "tomate"],
      "modo_preparo": "1. Cozinhe arroz (naturalmente sem glúten). 2. Prepare feijão sem temperos industrializados. 3. Asse batata e cenoura. 4. Adicione tomate fresco picado. 5. Tempere apenas com ervas naturais e azeite.",
      "tempo_preparo": "50 minutos",
      "porcoes": "4 porções",
      "restricoes_atendidas": ["vegana", "sem glúten", "sem açúcar"],
      "dica_conservacao": "Guarde separadamente para manter texturas"
    },
    {
      "nome": "Sobremesa Saudável Natural",
      "ingredientes": ["banana", "maçã"],
      "modo_preparo": "1. Corte a banana em rodelas. 2. Pique a maçã em cubos. 3. Misture as frutas. 4. Sirva fresco ou asse levemente para caramelização natural. 5. Opcional: adicione canela.",
      "tempo_preparo": "10 minutos",
      "porcoes": "2 porções",
      "restricoes_atendidas": ["vegana", "sem glúten", "sem açúcar"],
      "dica_conservacao": "Consuma imediatamente para evitar oxidação"
    }
  ],
  "alimentos_removidos": [
    {
      "alimento": "leite",
      "motivo": "Produto de origem animal (vegana)",
      "substituto_sugerido": "leite de arroz (sem glúten)"
    },
    {
      "alimento": "ovos",
      "motivo": "Produto de origem animal (vegana)",
      "substituto_sugerido": "gel de chia ou linhaça"
    },
    {
      "alimento": "farinha de trigo",
      "motivo": "Contém glúten",
      "substituto_sugerido": "farinha de arroz ou mandioca"
    },
    {
      "alimento": "açúcar",
      "motivo": "Restrição de açúcar",
      "substituto_sugerido": "frutas frescas para doçura natural"
    }
  ],
  "modo": "mock"
}
```

#### **Modelo 5: Sem Restrições (Todas as Receitas)**
```json
// REQUISIÇÃO
POST http://localhost:3000/api/publicacoes/mno-345/receitas-especiais?mock=true
Content-Type: application/json

{
  "restricoes": []
}

// RESPOSTA ESPERADA
{
  "publicacao": {
    "id": "mno-345",
    "titulo": "Cesta Completa",
    "alimentos": ["leite", "ovos", "farinha de trigo", "tomate", "cebola", "queijo", "frango"]
  },
  "restricoes_aplicadas": [],
  "dicas_nutricionais": [
    "Combinação completa de proteínas, carboidratos e vegetais",
    "Todos os alimentos podem ser utilizados livremente"
  ],
  "receitas": [
    {
      "nome": "Quiche Completa",
      "ingredientes": ["ovos", "leite", "farinha de trigo", "queijo", "tomate", "cebola"],
      "modo_preparo": "1. Prepare massa com farinha, ovos e leite. 2. Refogue tomate e cebola. 3. Monte a quiche com queijo e vegetais. 4. Asse por 35 minutos a 180°C.",
      "tempo_preparo": "50 minutos",
      "porcoes": "6 porções",
      "restricoes_atendidas": [],
      "dica_conservacao": "Mantém-se por 3 dias refrigerada"
    }
  ],
  "alimentos_removidos": [],
  "modo": "mock"
}
```

---

### �🔍 **Como Funciona no Backend**

**1️⃣ O usuário envia as restrições no corpo da requisição:**
```javascript
// Exemplo: Frontend envia isso
{
  "restricoes": ["sem lactose", "vegetariana"]
}
```

**2️⃣ O backend recebe e extrai as restrições ([openaiRoutes.js](routes/openaiRoutes.js#L438-L444)):**
```javascript
// Linha 438-444 em openaiRoutes.js
if (path.match(/\/api\/publicacoes\/[a-f0-9-]+\/receitas-especiais$/) && method === 'POST') {
  const id = path.split('/')[3];
  const body = await parseBody(req);  // 👈 Lê o corpo da requisição
  const restricoes = body.restricoes || [];  // 👈 AQUI pega as restrições que o usuário escolheu!
  
  // ... resto do código
}
```

**3️⃣ As restrições são usadas para filtrar alimentos ([openaiRoutes.js](routes/openaiRoutes.js#L59-L80)):**
```javascript
// Linha 59-80 - Função que filtra alimentos baseado nas restrições
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
  
  restricoes.forEach(restricao => {  // 👈 Para cada restrição escolhida pelo usuário
    const proibidos = alimentosProibidos[restricao] || [];
    alimentosFiltrados = alimentosFiltrados.filter(alimento => {
      return !proibidos.some(proibido => 
        alimento.toLowerCase().includes(proibido.toLowerCase())
      );
    });
  });

  return alimentosFiltrados;  // 👈 Retorna apenas alimentos permitidos
};
```

**4️⃣ Receitas são geradas respeitando as restrições ([openaiRoutes.js](routes/openaiRoutes.js#L115-L161)):**
```javascript
// Linha 115-161 - Gera receitas com as restrições aplicadas
const gerarReceitasComRestricoes = async (groqClient, alimentos, restricoes = [], usarMock = false) => {
  // Filtra alimentos que não podem ser usados
  let alimentosPermitidos = filtrarAlimentosPorRestricoes(alimentos, restricoes);  // 👈 Usa a função acima
  
  // Sugere substitutos para alimentos incompatíveis
  const alimentosComSubstitutos = alimentos.map(alimento => {
    const permitido = alimentosPermitidos.includes(alimento);
    if (!permitido) {
      const substituto = sugerirSubstitutos(alimento, restricoes);  // 👈 Substitui alimentos proibidos
      return { original: alimento, uso: substituto, substituido: substituto !== alimento };
    }
    return { original: alimento, uso: alimento, substituido: false };
  });

  return {
    receitas: [
      {
        nome: `Bowl Nutritivo Especial (${restricoes.join(', ')})`,  // 👈 Mostra restrições no nome
        ingredientes: alimentosComSubstitutos.slice(0, 5).map(a => a.uso),  // 👈 Usa substitutos
        restricoes_atendidas: restricoes  // 👈 Lista restrições aplicadas
      }
      // ... mais receitas
    ]
  };
};
```

**📝 Resumo do Fluxo:**
1. Usuário escolhe restrições: `["sem lactose", "vegetariana"]`
2. Backend recebe via `body.restricoes` (linha 442)
3. Alimentos são filtrados conforme restrições (linhas 59-80)
4. Substitutos são sugeridos para alimentos proibidos (linhas 82-104)
5. Receitas são criadas apenas com ingredientes permitidos (linhas 115-161)

#### 13. Receitas para Salvar Alimentos
```http
POST /api/receitas/salvar-alimentos?mock=true
Content-Type: application/json

{
  "alimentos": ["leite", "ovos", "tomate", "banana"],
  "restricoes": ["sem lactose", "vegetariana"]
}
```

**Resposta:**
```json
{
  "alimentos_utilizados": ["ovos", "tomate", "banana"],
  "restricoes_aplicadas": ["sem lactose", "vegetariana"],
  "receitas": [
    {
      "nome": "Bowl Nutritivo Especial (sem lactose, vegetariana)",
      "ingredientes": ["ovos", "tomate", "banana"],
      "modo_preparo": "1. Cozinhe os ovos...",
      "tempo_preparo": "35 minutos",
      "porcoes": "4 porções",
      "restricoes_atendidas": ["sem lactose", "vegetariana"],
      "dica_conservacao": "Armazene em recipiente hermético..."
    }
  ],
  "modo": "mock"
}
```

**Query Parameters:**
- `?mock=true` - Usa respostas simuladas (não consome créditos da Groq)
- Sem parâmetro - Usa IA real do Groq

---

## 📁 Estrutura do Projeto
