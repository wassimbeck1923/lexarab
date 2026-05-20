 'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [countries, setCountries] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [countryId, setCountryId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (loggedIn) {
      supabase.from('countries').select('*').order('name').then(({ data }) => {
        if (data) setCountries(data)
      })
    }
  }, [loggedIn])

  function handleLogin() {
    if (password === 'lexarab2024') {
      setLoggedIn(true)
    } else {
      setMessage('كلمة المرور خاطئة!')
    }
  }

  async function addLaw() {
    if (!title || !content || !countryId) {
      setMessage('يرجى ملء جميع الحقول')
      return
    }
    const { error } = await supabase.from('laws').insert({
      title, content, country_id: countryId
    })
    if (error) {
      setMessage('حدث خطأ: ' + error.message)
    } else {
      setMessage('✅ تم إضافة القانون بنجاح!')
      setTitle('')
      setContent('')
      setCountryId('')
    }
  }

  if (!loggedIn) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-2xl w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">لوحة التحكم</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 p-3 rounded-lg text-white mb-4"
            placeholder="كلمة المرور"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-bold"
          >
            دخول
          </button>
          {message && <p className="text-center text-red-400 mt-4">{message}</p>}
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">لوحة التحكم — إضافة قانون</h1>
        <div className="bg-gray-900 p-6 rounded-2xl space-y-4">
          <div>
            <label className="block mb-2">الدولة</label>
            <select
              value={countryId}
              onChange={(e) => setCountryId(e.target.value)}
              className="w-full bg-gray-800 p-3 rounded-lg text-white"
            >
              <option value="">اختر الدولة</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2">عنوان القانون</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 p-3 rounded-lg text-white"
              placeholder="مثال: نظام العمل"
            />
          </div>
          <div>
            <label className="block mb-2">نص القانون</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-gray-800 p-3 rounded-lg text-white h-40"
              placeholder="اكتب نص القانون هنا..."
            />
          </div>
          <button
            onClick={addLaw}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-bold"
          >
            إضافة القانون
          </button>
          {message && <p className="text-center text-green-400">{message}</p>}
        </div>
      </div>
    </main>
  )
}