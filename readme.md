# 🎓 Sistema de Gestão Acadêmica

Sistema full-stack para gerenciamento de alunos, disciplinas e matrículas com interface web moderna e API REST.

## 🚀 Início Rápido

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar bancos de dados (Docker)
```bash
npm run compose:up
```

### 3. Criar usuários iniciais
```bash
npm run seed:usuarios
```

### 4. Iniciar aplicação
```bash
npm run dev
```

### 5. Acessar no navegador
```
http://localhost:3000
```

## 🔐 Credenciais de Acesso

**Administrador** (acesso completo)
- Email: `admin@sistema.com`
- Senha: `admin123`

**Usuário** (somente visualização)
- Email: `usuario@sistema.com`
- Senha: `usuario123`

## ✨ Funcionalidades

### Interface Web
- ✅ Sistema de login com sessões
- ✅ CRUD completo de Alunos
- ✅ CRUD completo de Disciplinas
- ✅ Gerenciamento de Matrículas (N:N)
- ✅ Visualização de logs de acesso
- ✅ Controle de permissões (admin/usuário)
- ✅ Design responsivo e moderno

### API REST
Todas as rotas API disponíveis em `/api`:
- `GET/POST/PUT/DELETE /api/alunos` - Gerenciar alunos
- `GET/POST/PUT/DELETE /api/disciplinas` - Gerenciar disciplinas
- `POST /api/matriculas/matricular` - Matricular aluno
- `POST /api/matriculas/desmatricular` - Desmatricular aluno
- `GET /api/logs` - Visualizar logs
- `GET /api/health` - Status do sistema

## 🛠️ Tecnologias

**Backend**
- Node.js + Express
- Sequelize (PostgreSQL) - dados relacionais
- Mongoose (MongoDB) - logs de acesso
- Express Session - autenticação

**Frontend**
- Handlebars - template engine
- Bootstrap 5 - UI framework
- JavaScript vanilla

**Infraestrutura**
- Docker + Docker Compose
- PostgreSQL 16
- MongoDB 7

## 📁 Estrutura do Projeto

```
├── models/          # Modelos (Aluno, Disciplina, Usuario)
├── routes/          # Rotas da API e Views
├── views/           # Templates Handlebars
├── middleware/      # Autenticação e logs
├── public/          # CSS, JS e imagens
├── config/          # Configurações dos bancos
└── scripts/         # Seeds e utilitários
```

## 🔄 Controle de Acesso

### Usuário Comum
- Ver lista de alunos e disciplinas
- Acessar dashboard

### Administrador
- Todas as permissões do usuário comum
- Criar, editar e excluir alunos
- Criar, editar e excluir disciplinas
- Gerenciar matrículas
- Visualizar logs do sistema

## 🛑 Parar Aplicação

```bash
# Parar bancos de dados
npm run compose:down

# Ou parar apenas a aplicação (Ctrl+C)
```

## 📝 Observações

- Sessões expiram em 30 minutos de inatividade
- Logs registram todos os acessos automaticamente
- Interface atualiza logs a cada 10 segundos
- Design totalmente responsivo (mobile-friendly)

---

**Desenvolvido com ❤️ para Programação Web**

