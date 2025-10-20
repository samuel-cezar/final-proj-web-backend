# 🚀 Quick Start Guide

## Step 1: Start the Databases

```bash
npm run compose:up
```

Wait a few seconds for the databases to initialize.

## Step 2: Create Initial Users

```bash
npm run seed:usuarios
```

This will create:
- **Admin**: `admin@sistema.com` / `admin123`
- **User**: `usuario@sistema.com` / `usuario123`

## Step 3: Start the Application

```bash
npm run dev
```

## Step 4: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

Login with:
- **Email**: `admin@sistema.com`
- **Password**: `admin123`

## 🎉 You're Ready!

### What You Can Do:

#### As Admin:
1. **Create Students**: Click "Alunos" → "Criar"
2. **Create Courses**: Click "Disciplinas" → "Criar"
3. **Manage Enrollments**: Go to student or course detail page
4. **View All Enrollments**: Click "Matrículas"
5. **View Access Logs**: Click "Logs"

#### As Regular User:
Login with `usuario@sistema.com` / `usuario123` to see the limited view (read-only).

---

## 📡 API Access

All API routes are still available under `/api`:

### Students
- `GET /api/alunos` - List all students
- `GET /api/alunos/:id` - Get student by ID
- `POST /api/alunos` - Create student
- `PUT /api/alunos/:id` - Update student
- `DELETE /api/alunos/:id` - Delete student

### Courses
- `GET /api/disciplinas` - List all courses
- `GET /api/disciplinas/:id` - Get course by ID
- `POST /api/disciplinas` - Create course
- `PUT /api/disciplinas/:id` - Update course
- `DELETE /api/disciplinas/:id` - Delete course

### Enrollments
- `GET /api/matriculas/alunos/:id/disciplinas` - Get student's courses
- `POST /api/matriculas/matricular` - Enroll student in course
- `POST /api/matriculas/desmatricular` - Unenroll student from course

### Logs
- `GET /api/logs` - Get all access logs

---

## 🛑 Stop Everything

```bash
npm run compose:down
```

---

## 🔥 Test the Views

1. **Login Page** - `http://localhost:3000/login`
2. **Home** - `http://localhost:3000/home`
3. **Students List** - `http://localhost:3000/alunos`
4. **Courses List** - `http://localhost:3000/disciplinas`
5. **Enrollments** - `http://localhost:3000/matriculas` (admin only)
6. **Logs** - `http://localhost:3000/logs` (admin only)

---

## 📱 Mobile Responsive

The interface is fully responsive! Try resizing your browser or accessing from your phone.

---

## ⚡ Quick Test Workflow

1. Login as admin
2. Create a student (Alunos → Criar)
3. Create a course (Disciplinas → Criar)
4. Go to student's detail page
5. Click "Disciplinas" button
6. Enroll the student in the course
7. Go to "Matrículas" to see the enrollment
8. Go to "Logs" to see all your actions being logged

---

## 🎨 Customize

Want to change colors? Edit `public/css/estilo.css`:

```css
:root {
    --primary-color: #2563eb;  /* Change this */
    --success-color: #10b981;  /* And this */
    /* ... */
}
```

Want to change the logo? Replace `public/images/logo.svg` with your own image.

---

## 💡 Tips

- **Auto-refresh Logs**: The logs page auto-refreshes every 10 seconds
- **Real-time Updates**: All CRUD operations are immediate
- **Responsive Tables**: Tables scroll horizontally on mobile
- **Keyboard Shortcuts**: Standard browser shortcuts work
- **Multiple Sessions**: You can login as different users in different browsers

---

Happy Coding! 🎉

