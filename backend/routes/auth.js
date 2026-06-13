const express = require('express')
const router = express.Router()
const { register, login } = require('../controllers/authController')

// POST /api/auth/register — реєстрація
router.post('/register', register)

// POST /api/auth/login — вхід
router.post('/login', login)

module.exports = router