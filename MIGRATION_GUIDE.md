# 🔄 Migration Guide: API → Full-Stack

## What Changed?

This document explains what changed when migrating from a pure REST API to a full-stack application with views.

---

## 📍 API Routes Migration

### Before (Old Routes)
```
GET    /alunos
GET    /alunos/:id
POST   /alunos
PUT    /alunos/:id
DELETE /alunos/:id

GET    /disciplinas
GET    /disciplinas/:id
POST   /disciplinas
PUT    /disciplinas/:id
DELETE /disciplinas/:id

GET    /matriculas/alunos/:id/disciplinas
POST   /matriculas/matricular

GET    /logs

GET    /health
```

### After (New Routes)
```
GET    /api/alunos                          ✅ Same, just prefixed
GET    /api/alunos/:id                      ✅ Same, just prefixed
POST   /api/alunos                          ✅ Same, just prefixed
PUT    /api/alunos/:id                      ✅ Same, just prefixed
DELETE /api/alunos/:id                      ✅ Same, just prefixed

GET    /api/disciplinas                     ✅ Same, just prefixed
GET    /api/disciplinas/:id                 ✅ Same, just prefixed
POST   /api/disciplinas                     ✅ Same, just prefixed
PUT    /api/disciplinas/:id                 ✅ Same, just prefixed
DELETE /api/disciplinas/:id                 ✅ Same, just prefixed

GET    /api/matriculas/alunos/:id/disciplinas  ✅ Same, just prefixed
POST   /api/matriculas/matricular              ✅ Same, just prefixed
POST   /api/matriculas/desmatricular           🆕 NEW ENDPOINT

GET    /api/logs                            ✅ Same, just prefixed

GET    /api/health                          ✅ Same, just prefixed
```

### ⚠️ Breaking Change for API Clients

If you have external clients consuming your API, you need to update them to use `/api` prefix:

```javascript
// Before
fetch('http://localhost:3000/alunos')

// After
fetch('http://localhost:3000/api/alunos')
```

---

## 🆕 New View Routes

All new routes that render HTML pages:

```
GET    /                                    → Redirect to login or home
GET    /login                               → Login page
POST   /login                               → Process login
GET    /logout                              → Logout
GET    /home                                → Dashboard

GET    /alunos                              → List students (HTML)
GET    /alunos/criar                        → Create student form
POST   /alunos/criar                        → Create student
GET    /alunos/editar/:id                   → Edit student form
POST   /alunos/editar/:id                   → Update student
GET    /alunos/gerenciar-disciplinas/:id    → Manage student's courses

GET    /disciplinas                         → List courses (HTML)
GET    /disciplinas/criar                   → Create course form
POST   /disciplinas/criar                   → Create course
GET    /disciplinas/editar/:id              → Edit course form
POST   /disciplinas/editar/:id              → Update course
GET    /disciplinas/gerenciar-alunos/:id    → Manage course's students

GET    /matriculas                          → View all enrollments (admin only)
GET    /logs                                → View access logs (admin only)
```

---

## 📦 New Dependencies

```json
{
  "express-handlebars": "^7.1.2",    // Template engine
  "express-session": "^1.17.3",      // Session management
  "cookie-parser": "^1.4.7",         // Cookie handling
  "multer": "^1.4.5-lts.1"           // File uploads (ready to use)
}
```

---

## 🗂️ New Files Created

### Configuration
- `middleware/SessionControl.js` - Session and auth middleware

### Models
- `models/sql/Usuario.js` - User model for authentication

### Routes
- `routes/ViewRoutes.js` - All view rendering routes

### Views (Handlebars Templates)
- `views/layouts/main.handlebars` - Main layout with navbar
- `views/layouts/noMenu.handlebars` - Login layout
- `views/home.handlebars` - Home dashboard
- `views/usuario/login.handlebars` - Login page
- `views/aluno/*.handlebars` - 4 student views
- `views/disciplina/*.handlebars` - 4 course views
- `views/matricula/matriculaList.handlebars` - Enrollments view
- `views/log/logList.handlebars` - Logs view

### Public Assets
- `public/css/estilo.css` - Custom modern styling
- `public/js/app.js` - Frontend JavaScript
- `public/images/logo.svg` - Logo

### Scripts
- `scripts/seedUsuario.js` - Seed initial users

### Documentation
- `README_VIEWS.md` - Complete documentation
- `QUICK_START.md` - Quick start guide
- `MIGRATION_GUIDE.md` - This file

---

## 🔧 Modified Files

### `index.js`
**Changes:**
- Added Handlebars configuration
- Added session middleware
- Added static file serving
- Prefixed API routes with `/api`
- Added view routes import
- Added Handlebars helper `eq` for comparisons

**Before:**
```javascript
app.use('/alunos', alunosRoutes);
app.use('/disciplinas', disciplinasRoutes);
```

**After:**
```javascript
app.use('/api/alunos', alunosRoutes);
app.use('/api/disciplinas', disciplinasRoutes);
app.use('/', viewRoutes);
```

### `routes/Matriculas.js`
**Changes:**
- Added new `POST /desmatricular` endpoint

### `models/sql/index.js`
**Changes:**
- Added `Usuario` model export

### `package.json`
**Changes:**
- Added new dependencies
- Added `seed:usuarios` script

---

## 🔐 Authentication System

### New Database Table: `usuarios`

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(100) NOT NULL,
    admin BOOLEAN DEFAULT false,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP
);
```

### Session Configuration

```javascript
app.use(session({
    secret: 'sistema-academico-secreto-2025',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 60 * 1000 } // 30 minutes
}));
```

### Access Control

```javascript
// All view routes require authentication (except /login)
router.use(sessionControl);

// Some routes require admin
router.get('/alunos/criar', isAdmin, ...);
router.get('/matriculas', isAdmin, ...);
router.get('/logs', isAdmin, ...);
```

---

## 🎨 Design System

### Color Palette
```css
--primary-color: #2563eb      (Blue)
--success-color: #10b981      (Green)
--danger-color: #ef4444       (Red)
--warning-color: #f59e0b      (Orange)
--secondary-color: #64748b    (Gray)
```

### Components
- Modern cards with shadows
- Gradient backgrounds
- Bootstrap 5 components
- Bootstrap Icons
- Responsive tables
- Animated hover effects

---

## 🚀 Deployment Considerations

### Before Deploying to Production:

1. **Change Session Secret**
   ```javascript
   secret: process.env.SESSION_SECRET
   ```

2. **Hash Passwords**
   Install bcrypt and hash passwords:
   ```javascript
   const bcrypt = require('bcrypt');
   const hashedPassword = await bcrypt.hash(senha, 10);
   ```

3. **Environment Variables**
   Create `.env` file:
   ```
   PORT=3000
   SESSION_SECRET=your-secret-key
   DB_HOST=localhost
   DB_PASSWORD=your-password
   ```

4. **HTTPS Only Cookies**
   ```javascript
   cookie: { 
       maxAge: 30 * 60 * 1000,
       secure: true,  // HTTPS only
       httpOnly: true
   }
   ```

5. **Rate Limiting**
   Add rate limiting to prevent brute force:
   ```javascript
   const rateLimit = require('express-rate-limit');
   ```

---

## 🔄 Rollback Plan

If you need to rollback to the API-only version:

1. **Remove view routes**
   ```javascript
   // Comment out in index.js
   // app.use('/', viewRoutes);
   ```

2. **Remove `/api` prefix**
   ```javascript
   app.use('/alunos', alunosRoutes);
   app.use('/disciplinas', disciplinasRoutes);
   ```

3. **Remove dependencies** (optional)
   ```bash
   npm uninstall express-handlebars express-session cookie-parser multer
   ```

---

## 📊 Feature Comparison

| Feature | Before | After |
|---------|--------|-------|
| API | ✅ Yes | ✅ Yes (under `/api`) |
| Web Interface | ❌ No | ✅ Yes |
| Authentication | ❌ No | ✅ Yes (session-based) |
| User Management | ❌ No | ✅ Yes (admin/user roles) |
| File Uploads | ❌ No | 🟡 Ready (not implemented) |
| Logs Visualization | ❌ No | ✅ Yes (admin only) |
| Responsive Design | ❌ N/A | ✅ Yes (mobile-friendly) |
| Real-time Updates | ❌ No | ✅ Yes (logs auto-refresh) |

---

## 🧪 Testing Checklist

### API Endpoints (with Postman/curl)
- [ ] `GET /api/alunos` returns JSON
- [ ] `POST /api/alunos` creates student
- [ ] `PUT /api/alunos/:id` updates student
- [ ] `DELETE /api/alunos/:id` deletes student
- [ ] Same for `/api/disciplinas`
- [ ] `POST /api/matriculas/matricular` enrolls student
- [ ] `POST /api/matriculas/desmatricular` unenrolls student

### View Routes (in Browser)
- [ ] `GET /` redirects to login
- [ ] Login works with correct credentials
- [ ] Login fails with wrong credentials
- [ ] Admin can create students
- [ ] Admin can create courses
- [ ] Admin can manage enrollments
- [ ] Admin can view matriculas page
- [ ] Admin can view logs page
- [ ] Regular user cannot access admin pages
- [ ] Logout works

### UI/UX
- [ ] Layout looks good on desktop
- [ ] Layout looks good on mobile
- [ ] All buttons work
- [ ] All forms validate
- [ ] Tables are responsive
- [ ] Hover effects work

---

## 💬 Support

If you encounter issues:

1. Check database connections
2. Verify users exist (`npm run seed:usuarios`)
3. Check browser console for errors
4. Check server logs
5. Verify all dependencies are installed

---

## 📚 Additional Resources

- [Express Handlebars Docs](https://github.com/express-handlebars/express-handlebars)
- [Express Session Docs](https://github.com/expressjs/session)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.3/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)

---

**Migration completed successfully! 🎉**

