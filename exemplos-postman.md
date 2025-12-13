# Exemplos de Requisições - Perfil Maria

## 👤 GERENCIAR MEU PERFIL

### 1. Criar Meu Perfil
**POST** `http://localhost:3000/api/perfil`

Body (JSON):
```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "telefone": "(11) 98765-4321",
  "endereco": "Rua das Flores, 123"
}
```

### 2. Ver Meu Perfil
**GET** `http://localhost:3000/api/perfil/1`

### 3. Atualizar Meu Perfil
**PUT** `http://localhost:3000/api/perfil/1`

Body (JSON):
```json
{
  "telefone": "(11) 99999-8888",
  "endereco": "Rua Nova, 456"
}
```

### 4. Deletar Meu Perfil
**DELETE** `http://localhost:3000/api/perfil/1`

---

## 🛒 MINHAS COLETAS DE CESTA BÁSICA

### 5. Agendar Coleta de Cesta Básica
**POST** `http://localhost:3000/api/minhas-coletas`

Body (JSON):
```json
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

### 6. Ver Minhas Coletas
**GET** `http://localhost:3000/api/minhas-coletas/1`

### 7. Cancelar Minha Coleta
**DELETE** `http://localhost:3000/api/minhas-coletas/cancelar/1`

---

## 📢 PUBLICAÇÕES E INTERESSE

### 8. Ver Publicações Disponíveis
**GET** `http://localhost:3000/api/publicacoes`

### 9. Demonstrar Interesse em Publicação
**POST** `http://localhost:3000/api/publicacoes/1/interesse`

Body (JSON):
```json
{
  "usuarioId": 1
}
```

### 10. Ver Minhas Reações/Interesses
**GET** `http://localhost:3000/api/minhas-reacoes/1`
