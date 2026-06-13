// Підключення змінних оточення (якщо вони у вас у .env)
require('dotenv').config();

// 1. Ініціалізація Groq
const Groq = require('groq-sdk');
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// 2. Ініціалізація Supabase
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 3. Функція генерації
const generateResume = async (req, res) => {
  try {
    const { name, position, experience, skills, style, language, userId } = req.body

    // ── Перевірка лімі ту (за останні 24 години) ──
    const oneDayAgo = new Date()
    oneDayAgo.setHours(oneDayAgo.getHours() - 24)

    const { data: existingResumes, error: countError } = await supabase
      .from('resumes')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', oneDayAgo.toISOString())

    if (countError) throw countError

    const LIMIT = 5

    if (existingResumes.length >= LIMIT) {
      return res.status(403).json({
        success: false,
        limitReached: true,
        message: 'Ви досягли лімі ту на 24 години. Спробуйте пізніше або перейдіть на Pro'
      })
    }
    // ── Кінець перевірки ──

    const prompt = `IMPORTANT: Write the ENTIRE resume ONLY in ${language} language. Every single word, including section headers, must be in ${language}. Do not mix languages.

Create a professional resume with the following candidate data:

Name: ${name}
Desired position: ${position}
Work experience: ${experience}
Skills: ${skills}
Style: ${style}

Requirements:
- Structure the resume professionally
- No filler words
- Use markdown formatting
- Sections: Profile/Summary, Experience, Skills, Education
- Remember: EVERYTHING must be written in ${language}, including all headers and labels`

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    })

    const resumeText = completion.choices[0].message.content

    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: userId,
        name,
        position,
        language,
        style,
        content: resumeText
      })
      .select()

    if (error) throw error

    res.json({ success: true, resume: resumeText, data: data[0] })

  } catch (error) {
    console.error("❌ Помилка в generateResume:", error);
    res.status(500).json({ success: false, message: error.message })
  }
}

// 4. Функція отримання резюме
const getResumes = async (req, res) => {
  try {
    const { userId } = req.params; 

    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    console.error("❌ Помилка в getResumes:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

// 5. Експорт
module.exports = {
  generateResume,
  getResumes
};