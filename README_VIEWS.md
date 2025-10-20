# Sistema de Gestão Acadêmica - Views Implementation

## 📋 Resumo das Mudanças (TL;DR)

Este projeto foi transformado de uma API REST pura em uma aplicação full-stack com interface web usando Handlebars. **Todas as rotas API originais foram mantidas e agora estão sob o prefixo `/api`**. Foi adicionado um sistema completo de views com autenticação, sessões, e CRUD para Alunos, Disciplinas e Matrículas, além de visualização de logs em tempo real. O design usa Bootstrap 5 com um estilo moderno e minimalista customizado.

---

## 🎯 O Que Foi Implementado

### 1. **Estrutura de Diretórios Criada**
```
trabalho-web-backend/
├── public/
│   ├── css/
│   │   └── estilo.css          # Estilos modernos e minimalistas
│   ├── js/
│   │   └── app.js              # Scripts do front-end
│   ├── images/                 # Placeholder para logo
│   └── uploads/                # Uploads de arquivos
├── views/
│   ├── layouts/
│   │   ├── main.handlebars     # Layout com navbar
│   │   └── noMenu.handlebars   # Layout para login
│   ├── aluno/
│   │   ├── alunoList.handlebars
│   │   ├── alunoCreate.handlebars
│   │   ├── alunoUpdate.handlebars
│   │   └── alunoGerenciarDisciplinas.handlebars
│   ├── disciplina/
│   │   ├── disciplinaList.handlebars
│   │   ├── disciplinaCreate.handlebars
│   │   ├── disciplinaUpdate.handlebars
│   │   └── disciplinaGerenciarAlunos.handlebars
│   ├── matricula/
│   │   └── matriculaList.handlebars
│   ├── log/
│   │   └── logList.handlebars
│   ├── usuario/
│   │   └── login.handlebars
│   └── home.handlebars
├── middleware/
│   └── SessionControl.js       # Middleware de autenticação e sessão
├── models/sql/
│   └── Usuario.js              # Modelo de usuário
├── routes/
│   └── ViewRoutes.js           # Rotas para renderizar views
└── scripts/
    └── seedUsuario.js          # Script para criar usuários iniciais
```

### 2. **Sistema de Autenticação**
- **Login/Logout** com sessões
- **Modelo de Usuário** com campos: `nome`, `email`, `senha`, `admin`
- **Controle de acesso**: algumas views são admin-only
- **Middleware** `SessionControl.js` para proteger rotas

### 3. **API Routes (Agora sob `/api`)**
Todas as rotas API originais foram mantidas, mas agora estão prefixadas com `/api`:
- `/api/alunos` - CRUD de alunos
- `/api/disciplinas` - CRUD de disciplinas
- `/api/matriculas` - Gerenciar matrículas
  - **Novo endpoint**: `POST /api/matriculas/desmatricular`
- `/api/logs` - Visualizar logs
- `/api/health` - Health check

### 4. **View Routes (Novas)**

#### **Públicas (requerem autenticação)**
- `GET /` - Redireciona para login ou home
- `GET /login` - Página de login
- `POST /login` - Processar login
- `GET /logout` - Logout
- `GET /home` - Dashboard principal

#### **Alunos** (todos podem visualizar, admin pode editar)
- `GET /alunos` - Listar todos os alunos
- `GET /alunos/criar` - Formulário criar (admin only)
- `POST /alunos/criar` - Criar aluno (admin only)
- `GET /alunos/editar/:id` - Formulário editar (admin only)
- `POST /alunos/editar/:id` - Editar aluno (admin only)
- `GET /alunos/gerenciar-disciplinas/:id` - Gerenciar disciplinas do aluno (admin only)

#### **Disciplinas** (todos podem visualizar, admin pode editar)
- `GET /disciplinas` - Listar todas as disciplinas
- `GET /disciplinas/criar` - Formulário criar (admin only)
- `POST /disciplinas/criar` - Criar disciplina (admin only)
- `GET /disciplinas/editar/:id` - Formulário editar (admin only)
- `POST /disciplinas/editar/:id` - Editar disciplina (admin only)
- `GET /disciplinas/gerenciar-alunos/:id` - Gerenciar alunos da disciplina (admin only)

#### **Matrículas** (admin only)
- `GET /matriculas` - Visualizar todas as matrículas (readonly)

#### **Logs** (admin only)
- `GET /logs` - Visualizar logs de acesso (atualiza a cada 10s)

### 5. **Funcionalidades Especiais**

#### **Gerenciamento de Relacionamentos**
Tanto na página de Alunos quanto na de Disciplinas, admins podem:
- Adicionar/remover disciplinas de um aluno
- Adicionar/remover alunos de uma disciplina
- Interface intuitiva com botões de adicionar/remover

#### **Logs em Tempo Real**
- Auto-refresh a cada 10 segundos
- Mostra os últimos 100 logs
- Badges coloridos por método HTTP
- Formato legível com timestamp em PT-BR

### 6. **Design Moderno e Minimalista**
- **Gradiente de fundo** roxo/azul
- **Cards com sombras** e efeitos hover
- **Navbar translúcida** com blur effect
- **Badges e botões** com gradientes
- **Tabelas responsivas** com hover effects
- **Bootstrap 5** + **Bootstrap Icons**
- **Animações suaves** em transições

---

## 🚀 Como Usar

### 1. **Instalar Dependências**
```bash
npm install
```

### 2. **Iniciar Bancos de Dados (Docker)**
```bash
# Usando docker-compose
npm run compose:up

# OU individualmente
npm run start:postgres
npm run start:mongo
```

### 3. **Criar Usuários Iniciais**
```bash
npm run seed:usuarios
```

Isso criará:
- **Admin**: `admin@sistema.com` / `admin123`
- **Usuário**: `usuario@sistema.com` / `usuario123`

### 4. **Iniciar Servidor**
```bash
npm run dev
```

### 5. **Acessar**
- **Views**: `http://localhost:3000`
- **API**: `http://localhost:3000/api/*`

---

## 🔐 Credenciais de Teste

### Admin (acesso completo)
- **Email**: `admin@sistema.com`
- **Senha**: `admin123`

### Usuário Comum (somente visualização)
- **Email**: `usuario@sistema.com`
- **Senha**: `usuario123`

---

## 📦 Pacotes Adicionados

```json
{
  "express-handlebars": "^7.1.2",
  "express-session": "^1.17.3",
  "cookie-parser": "^1.4.7",
  "multer": "^1.4.5-lts.1"
}
```

---

## 🎨 Funcionalidades por Tipo de Usuário

### Usuário Comum
- ✅ Ver lista de alunos
- ✅ Ver lista de disciplinas
- ✅ Ver home/dashboard
- ❌ Criar/editar/excluir qualquer entidade
- ❌ Ver matrículas
- ❌ Ver logs

### Admin
- ✅ **Tudo que usuário comum pode**
- ✅ Criar/editar/excluir alunos
- ✅ Criar/editar/excluir disciplinas
- ✅ Gerenciar matrículas (adicionar/remover)
- ✅ Ver página de matrículas (readonly)
- ✅ Ver logs de acesso
- ✅ Acesso a todos os menus

---

## 🔧 Estrutura de Middleware

### LogAcesso.js (já existia)
- Registra todos os acessos no MongoDB

### SessionControl.js (novo)
```javascript
- sessionControl: Protege rotas, redireciona para login se não autenticado
- isAdmin: Permite apenas admins
- addSessionToLocals: Adiciona dados da sessão às views (login, admin)
```

---

## 📊 Fluxo de Navegação

```
/ → Login (se não autenticado) → Home
                                   ├── Alunos
                                   │   ├── Listar
                                   │   ├── Criar (admin)
                                   │   ├── Editar (admin)
                                   │   └── Gerenciar Disciplinas (admin)
                                   ├── Disciplinas
                                   │   ├── Listar
                                   │   ├── Criar (admin)
                                   │   ├── Editar (admin)
                                   │   └── Gerenciar Alunos (admin)
                                   ├── Matrículas (admin)
                                   └── Logs (admin)
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'express-handlebars'"
```bash
npm install express-handlebars express-session cookie-parser multer
```

### Erro ao fazer login: "Usuario is not defined"
```bash
npm run seed:usuarios
```

### Views não estão carregando CSS
Verifique se a pasta `public/` está sendo servida:
```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

### API não funciona mais
As rotas API agora estão sob `/api`. Exemplo:
- Antes: `GET /alunos`
- Agora: `GET /api/alunos`

---

## 📝 Notas Importantes

1. **Senhas em produção**: As senhas estão sendo armazenadas em texto plano. Em produção, use `bcrypt` para hash.
2. **Session Secret**: Troque o secret da sessão em produção.
3. **CORS**: A API ainda permite CORS para uso externo.
4. **Upload de arquivos**: A estrutura está pronta, mas não implementada.
5. **Validações**: Validações básicas no front-end, considere adicionar mais no back-end.

---

## 🎉 Conclusão

Seu sistema agora é uma aplicação full-stack moderna com:
- ✅ API REST completa (sob `/api`)
- ✅ Interface web bonita e responsiva
- ✅ Sistema de autenticação
- ✅ Controle de acesso por perfil
- ✅ CRUD completo para todas entidades
- ✅ Gerenciamento de relacionamentos
- ✅ Logs em tempo real
- ✅ Design moderno e minimalista

**Tudo pronto para ser apresentado! 🚀**

