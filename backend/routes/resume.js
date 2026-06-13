const express = require('express')
const router = express.Router()
const { generateResume, getResumes } = require('../controllers/resumeController')

// POST /api/resume/generate — генерація
router.post('/generate', generateResume)

// GET /api/resume/:userId — отримати резюме користувача
router.get('/:userId', getResumes)

module.exports = router