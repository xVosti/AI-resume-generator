const expess = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const resumeRoutes = require('./routes/resume')

const app = expess()

// Дозволяємо frontend говорити з backend
app.use(cors())

// Дозволяємо приймати JSON дані
app.use(expess.json())

// Підключаємо роути
app.use('/api/auth', authRoutes)
app.use('/api/resume', resumeRoutes)

// Тестовий роут — перевірка що сервер живий
app.get('/', (req, res) => {
    res.json({ message: 'ResumeAi Backend працює!'})
})

// Запускаємо сервер на порту 5000
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`)
})