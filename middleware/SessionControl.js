// Middleware para controlar sessões
const sessionControl = (req, res, next) => {
    // Rotas públicas que não precisam de autenticação
    const publicRoutes = ['/', '/login', '/logout'];
    
    // Rotas da API não precisam de sessão (podem usar outros métodos de auth)
    if (req.path.startsWith('/api/')) {
        return next();
    }
    
    // Se é rota pública ou usuário está logado, continua
    if (publicRoutes.includes(req.path) || req.session.usuario) {
        return next();
    }
    
    // Se não está logado e tenta acessar rota protegida, redireciona para login
    res.redirect('/login');
};

// Middleware para verificar se usuário é admin
const isAdmin = (req, res, next) => {
    if (req.session.usuario && req.session.usuario.admin) {
        return next();
    }
    res.status(403).render('error', { 
        message: 'Acesso negado. Apenas administradores podem acessar esta página.',
        layout: 'main',
        login: req.session.usuario?.nome
    });
};

// Middleware para adicionar dados da sessão às views
const addSessionToLocals = (req, res, next) => {
    res.locals.login = req.session.usuario?.nome;
    res.locals.admin = req.session.usuario?.admin || false;
    next();
};

module.exports = {
    sessionControl,
    isAdmin,
    addSessionToLocals
};

