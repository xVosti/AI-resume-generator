const { createClient } = require('@supabase/supabase-js')

// Підключення до Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

// Реєстрація
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    })

    if (error) throw error

    // Перевірка — якщо identities порожній, email вже зареєстрований
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Цей email вже зареєстрований. Спробуй увійти.'
      })
    }

    res.json({ success: true, user: data.user, session: data.session })

  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// Вхід
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    res.json({ success: true, user: data.user, session: data.session })

  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

module.exports = { register, login }