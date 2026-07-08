

'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleLogin = async () => {
    await supabase.auth.signInWithOtp({ email })
    setSent(true)
  }

  return (
    <main style={{minHeight:'100vh', background:'#0a0a0a', color:'white', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'1rem'}}>
      <h1>تسجيل الدخول</h1>
      {sent ? (
        <p>تم إرسال رابط الدخول لإيميلك. افتح الإيميل ودوس على الرابط.</p>
      ) : (
        <>
          <input
            type="email"
            placeholder="بريدك الإلكتروني"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{padding:'0.75rem', borderRadius:'0.5rem', border:'1px solid #333', background:'#111', color:'white'}}
          />
          <button onClick={handleLogin} style={{padding:'0.75rem 2rem', background:'#2563eb', color:'white', border:'none', borderRadius:'0.5rem'}}>
            إرسال رابط الدخول
          </button>
        </>
      )}
    </main>
  )
}
