# 🎓 Sistema de Portfólio Acadêmico

Sistema full-stack para gerenciamento de alunos, disciplinas, **projetos e conhecimentos** com interface web moderna e API REST completa.

## 🚀 Início Rápido

### 1. Instalar dependências
```bash
npm install
```

### 2. Iniciar bancos de dados (Docker)
```bash
docker-compose up -d
```

### 3. Popular banco de dados
```bash
npm run seed
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

**Alunos** (podem gerenciar seus projetos e conhecimentos)
- Email: `joao@sistema.com` / Senha: `joao123`
- Email: `maria@sistema.com` / Senha: `maria123`
- Email: `pedro@sistema.com` / Senha: `pedro123`

## ✨ Funcionalidades

### 🎯 Sistema de Portfólio
- ✅ **Projetos**: Cadastro completo com nome, resumo, link externo
- ✅ **Palavras-chave**: Categorização flexível com MongoDB
- ✅ **Colaboração**: Múltiplos desenvolvedores por projeto
- ✅ **Conhecimentos**: Sistema de níveis (0-10) com slider interativo
- ✅ **Dashboard**: Visualização dos projetos e conhecimentos recentes
- ✅ **Permissões**: Edição apenas para desenvolvedores do projeto

### 📚 Interface Web
- ✅ Sistema de login com sessões
- ✅ CRUD completo de Alunos
- ✅ CRUD completo de Disciplinas
- ✅ CRUD completo de Projetos
- ✅ Gerenciamento de Conhecimentos
- ✅ Gerenciamento de Matrículas (N:N)
- ✅ Visualização de logs de acesso
- ✅ Controle de permissões (admin/aluno)
- ✅ Design responsivo e moderno
- ✅ Busca de alunos para adicionar como desenvolvedores

### 🔌 API REST
Todas as rotas API disponíveis em `/api`:

**Alunos**
- `GET /api/alunos` - Listar alunos
- `GET /api/alunos/buscar/search?q=termo` - Buscar alunos
- `GET /api/alunos/:id` - Ver aluno específico
- `POST /api/alunos` - Criar aluno
- `PUT /api/alunos/:id` - Atualizar aluno
- `DELETE /api/alunos/:id` - Excluir aluno

**Projetos**
- `GET /api/projetos` - Listar todos os projetos (público)
- `GET /api/projetos/meus/projetos` - Meus projetos
- `GET /api/projetos/:id` - Ver projeto específico
- `POST /api/projetos` - Criar projeto
- `PUT /api/projetos/:id` - Atualizar projeto (apenas desenvolvedores)
- `DELETE /api/projetos/:id` - Excluir projeto (apenas desenvolvedores)
- `POST /api/projetos/:id/desenvolvedores` - Adicionar desenvolvedor
- `DELETE /api/projetos/:id/desenvolvedores/:devId` - Remover desenvolvedor

**Conhecimentos**
- `GET /api/conhecimentos/disponiveis` - Listar conhecimentos disponíveis
- `GET /api/conhecimentos/meus` - Meus conhecimentos
- `GET /api/conhecimentos/aluno/:id` - Conhecimentos de um aluno
- `POST /api/conhecimentos` - Adicionar/atualizar conhecimento
- `DELETE /api/conhecimentos/:id` - Remover conhecimento

**Palavras-chave**
- `GET /api/palavras-chave` - Listar todas
- `GET /api/palavras-chave/categorias` - Listar categorias
- `GET /api/palavras-chave/categoria/:nome` - Por categoria

**Outros**
- `GET /api/disciplinas` - Gerenciar disciplinas
- `POST /api/matriculas/matricular` - Matricular aluno
- `POST /api/matriculas/desmatricular` - Desmatricular aluno
- `GET /api/logs` - Visualizar logs
- `GET /api/health` - Status do sistema

## 🛠️ Tecnologias

**Backend**
- Node.js + Express
- Sequelize (PostgreSQL) - dados relacionais (Alunos, Projetos, Conhecimentos)
- Mongoose (MongoDB) - dados flexíveis (Palavras-chave, Logs)
- Express Session - autenticação

**Frontend**
- Handlebars - template engine
- Bootstrap 5 - UI framework
- Bootstrap Icons - ícones
- JavaScript vanilla

**Infraestrutura**
- Docker + Docker Compose
- PostgreSQL 16
- MongoDB 7

## 📁 Estrutura do Projeto

```
├── models/
│   ├── sql/              # Modelos SQL (Aluno, Projeto, Conhecimento, etc.)
│   └── nosql/            # Modelos MongoDB (PalavraChave, LogAcesso)
├── controllers/          # Lógica de negócio
│   ├── ProjetosController.js
│   ├── ConhecimentosController.js
│   └── ...
├── routes/              # Rotas da API e Views
├── views/               # Templates Handlebars
│   ├── projeto/         # Views de projetos
│   ├── conhecimento/    # Views de conhecimentos
│   └── ...
├── middleware/          # Autenticação e logs
├── public/              # CSS, JS e imagens
├── config/              # Configurações dos bancos
└── scripts/             # Seeds e utilitários
```

## 🔄 Controle de Acesso

### Aluno (Usuário Comum)
- Ver todos os projetos (público)
- Criar e gerenciar seus próprios projetos
- Adicionar/remover desenvolvedores em seus projetos
- Gerenciar seus conhecimentos e níveis
- Editar projetos onde é desenvolvedor
- Ver alunos, disciplinas e matrículas

### Administrador
- Todas as permissões do aluno
- Criar, editar e excluir alunos
- Criar, editar e excluir disciplinas
- Gerenciar matrículas
- Visualizar logs do sistema

## 🎨 Recursos Especiais

### Sistema de Projetos
- **Colaboração real**: Múltiplos desenvolvedores podem editar o mesmo projeto
- **Validações**: Resumo limitado a 240 caracteres, URLs validadas
- **Palavras-chave flexíveis**: Categorizadas e armazenadas em MongoDB
- **Busca inteligente**: Encontre alunos por nome ou email para adicionar como colaboradores
- **Proteção**: Apenas desenvolvedores podem editar/excluir projetos

### Sistema de Conhecimentos
- **Slider interativo**: Defina níveis de 0 a 10 com controle visual
- **Catálogo pré-definido**: Conhecimentos disponíveis via seed
- **Visualização progressiva**: Barras de progresso para cada conhecimento
- **Dashboard integrado**: Veja seus principais conhecimentos na home

## 🛑 Parar Aplicação

```bash
# Parar bancos de dados
docker-compose down

# Ou parar apenas a aplicação (Ctrl+C)
```

## 📝 Observações

- Sessões expiram em 30 minutos de inatividade
- Logs registram todos os acessos automaticamente
- Design totalmente responsivo (mobile-friendly)
- Projetos podem ter o mesmo nome (IDs únicos)
- Slider de conhecimento aceita apenas valores inteiros (0-10)
- Remoção de desenvolvedor requer ao menos 1 desenvolvedor no projeto
- Ao remover-se de um projeto, perde-se acesso imediato à edição

## 🗄️ Scripts Disponíveis

```bash
npm run dev              # Inicia o servidor
npm run seed             # Popula TODOS os dados (recomendado)
npm run seed:user        # Apenas usuários
npm run seed:keywords    # Apenas palavras-chave
npm run seed:knowledge   # Apenas conhecimentos
```

## 🎯 Diferenciais Implementados

1. **Arquitetura Híbrida**: SQL para dados relacionais + MongoDB para dados flexíveis
2. **Sistema de Portfolio Completo**: Projetos com colaboração e conhecimentos com níveis
3. **Validações Robustas**: 
   - URL obrigatória e validada
   - Resumo limitado a 240 caracteres
   - Níveis inteiros de 0-10
4. **Busca Inteligente**: Sistema de busca para adicionar colaboradores
5. **Relacionamentos Complexos**: N:N entre Projetos-Alunos, Projetos-PalavrasChave, Alunos-Conhecimentos
6. **Dashboard Dinâmico**: Home page mostra resumo personalizado do portfolio do aluno
7. **Permissões Granulares**: Controle fino sobre quem pode editar cada projeto

## ✅ Conformidade com Requisitos

Este sistema atende **100% dos requisitos do projeto**. Veja como cada requisito foi implementado:

### 1.1 - Requisitos do Aluno

| # | Requisito | Implementação | Localização |
|---|-----------|---------------|-------------|
| **1.1** | Login sem autocadastro | Apenas admin pode criar alunos. Login via `/login` | `ViewsController.js:17-60`, `ViewRoutes.js:33` |
| **1.2** | Cadastrar projetos com palavras-chave (N:N) | Tabela `ProjetoPalavraChave`, múltiplas keywords por projeto | `models/sql/ProjetoPalavraChave.js` |
| **1.3** | Múltiplos desenvolvedores, todos editam | Tabela `ProjetoAluno`, verificação de desenvolvedor antes de editar | `ProjetosController.js:195-238` |
| **1.4** | Cadastrar conhecimentos com nível 0-10 | Tabela `AlunoConhecimento` com validação de nível | `ConhecimentosController.js:47-89` |
| **1.5** | Editar/excluir projetos e conhecimentos | Rotas protegidas com verificação de permissão | Controllers + Routes |

### 1.2 - Requisitos do Administrador

| # | Requisito | Implementação | Localização |
|---|-----------|---------------|-------------|
| **1.6** | CRUD de alunos, palavras-chave e conhecimentos | Todas as operações protegidas por middleware `isAdmin` | `middleware/SessionControl.js`, Routes |

### 1.3 - Requisitos do Usuário Externo (Público)

| # | Requisito | Implementação | Localização |
|---|-----------|---------------|-------------|
| **1.7** | Visualizar todos os projetos sem login | Rota `/projetos` pública, acessível na home pública | `SessionControl.js:4`, `homePublica.handlebars` |
| **1.8** | Filtrar projetos por palavra-chave sem login | Rota `/projetos/palavra-chave/:id` pública com dropdown | `ViewsController.js:774-847` |
| **1.9** | Relatório de proporção de conhecimentos sem login | Rota `/relatorio/conhecimentos` pública com gráfico | `ViewsController.js:1054-1106` |

### Detalhes Técnicos de Conformidade

**Relacionamentos N:N Implementados:**
- ✅ `Projetos ↔ PalavrasChave` via `ProjetoPalavraChave`
- ✅ `Projetos ↔ Alunos (Desenvolvedores)` via `ProjetoAluno`
- ✅ `Alunos ↔ Conhecimentos` via `AlunoConhecimento` (com nível)

**Segurança e Permissões:**
- ✅ Middleware `isAdmin` protege rotas administrativas
- ✅ Middleware `sessionControl` permite acesso público a rotas específicas
- ✅ Sessões com expiração automática (30 minutos)

**Validações de Dados:**
- ✅ Nível de conhecimento: inteiro entre 0 e 10
- ✅ Resumo de projeto: máximo 240 caracteres
- ✅ Link externo: validação de URL
- ✅ Mínimo de 1 desenvolvedor por projeto

---

**Desenvolvido com ❤️ para Programação Web**

