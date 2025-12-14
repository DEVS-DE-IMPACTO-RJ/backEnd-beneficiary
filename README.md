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
```http
GET /api/perfil/{id}
```

#### 3. Atualizar Perfil
```http
PUT /api/perfil/{id}
Content-Type: application/json

{
  "telefone": "(11) 99999-8888",
  "endereco": "Rua Nova, 456"
}
```

#### 4. Deletar Perfil
```http
DELETE /api/perfil/{id}
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
```http
GET /api/minhas-coletas/{usuarioId}
```

#### 7. Cancelar Coleta
```http
DELETE /api/minhas-coletas/cancelar/{coletaId}
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
```http
POST /api/publicacoes/{id}/interesse
Content-Type: application/json

{
  "usuarioId": 1
}
```

#### 10. Ver Meus Interesses
```http
GET /api/minhas-reacoes/{usuarioId}
```

---

### 🤖 **IA - Dicas Nutricionais (Groq)**

#### 11. Dicas da Cesta (Simples)
```http
GET /api/publicacoes/{id}/dicas?mock=true
```

**Resposta:**
```json
{
  "publicacao": {
    "id": 1,
    "titulo": "Cesta Básica Completa",
    "alimentos": ["leite", "ovos", "farinha de trigo"]
  },
  "dicas_nutricionais": [
    "Os alimentos leite e ovos são ricos em vitaminas...",
    "Esta combinação fornece proteínas..."
  ],
  "receitas": [
    {
      "nome": "Salada Completa com leite",
      "ingredientes": ["leite", "ovos", "farinha de trigo"],
      "modo_preparo": "1. Lave bem...",
      "tempo_preparo": "20 minutos",
      "porcoes": "3 porções"
    }
  ],
  "modo": "mock"
}
```

#### 12. Dicas com Restrições Alimentares
```http
POST /api/publicacoes/{id}/receitas-especiais?mock=true
Content-Type: application/json

{
  "restricoes": ["sem lactose", "vegetariana"]
}
```

**Restrições disponíveis:**
- `vegetariana`
- `vegana`
- `sem lactose`
- `sem glúten`
- `sem açúcar`
- `low carb`
- `diabética`
- `sem frutos do mar`
- `sem oleaginosas`

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
