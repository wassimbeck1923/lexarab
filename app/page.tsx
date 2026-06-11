'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [countries, setCountries] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('countries')
      .select('*')
      .order('name_ar')
      .then(({ data }) => {
        if (data) setCountries(data)
      })
  }, [])

  return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',color:'white',padding:'2rem'}}>
      <h1 style={{textAlign:'center',fontSize:'2rem',marginBottom:'0.5rem'}}>LexArab AI</h1>
      <p style={{textAlign:'center',color:'#888',marginBottom:'2rem'}}>منصة الذكاء القانوني العربي</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',maxWidth:'900px',margin:'0 auto'}}>
        {countries.map((c) => (
          <a href={`/country/${c.code}`} key={c.id} style={{background:'#111',border:'1px solid #333',borderRadius:'1rem',padding:'1.5rem',textAlign:'center',cursor:'pointer',textDecoration:'none',color:'white'}}>
            <div style={{fontSize:'2.5rem'}}>{c.flag}</div>
            <div style={{fontWeight:'bold',marginTop:'0.5rem'}}>{c.name_ar}</div>
            <div style={{color:'#888',fontSize:'0.9rem'}}>{c.name_en}</div>
          </a>
        ))}
      </div>
    </main>
  )
}