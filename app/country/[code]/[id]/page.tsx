'use client'
import { useEffect, useState, use } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LawPage({ params }: { params: Promise<{ code: string, id: string }> }) {
  const { code, id } = use(params)
  const [law, setLaw] = useState<any>(null)

  useEffect(() => {
    supabase.from('laws').select('*').eq('id', id).single()
      .then(({ data }) => setLaw(data))
  }, [id])

  if (!law) return <main style={{minHeight:'100vh',background:'#0a0a0a',color:'white',padding:'2rem',textAlign:'center'}}><a href={`/country/${code}`} style={{color:'#888',textDecoration:'none'}}>← رجوع</a><p style={{marginTop:'2rem'}}>جاري التحميل...</p></main>

  const fullText = law.content || law.preview_content || ''
  const words = fullText.split(' ')
  const preview = words.slice(0, Math.ceil(words.length * 0.2)).join(' ')

  return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',color:'white',padding:'2rem'}}>
      <a href={`/country/${code}`} style={{color:'#888',textDecoration:'none'}}>← رجوع</a>
      <div style={{maxWidth:'800px',margin:'2rem auto'}}>
        <h1 style={{fontSize:'1.8rem',marginBottom:'0.5rem'}}>{law.title}</h1>
        <div style={{color:'#888',marginBottom:'2rem'}}>{law.category} — {law.law_number}</div>
        <div style={{background:'#111',border:'1px solid #333',borderRadius:'1rem',padding:'2rem',lineHeight:'2',color:'#ccc',marginBottom:'2rem'}}>
          {preview}...
        </div>
        <div style={{background:'#111',border:'2px solid #2563eb',borderRadius:'1rem',padding:'2rem',textAlign:'center'}}>
          <div style={{fontSize:'2rem',marginBottom:'1rem'}}>🔒</div>
          <h2 style={{marginBottom:'0.5rem'}}>اشترك لقراءة القانون كاملاً</h2>
          <p style={{color:'#888',marginBottom:'1.5rem'}}>وصول كامل لجميع قوانين 15 دولة</p>
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap',marginBottom:'1.5rem'}}>
            <div style={{background:'#1e3a5f',borderRadius:'1rem',padding:'1rem 1.5rem',textAlign:'center'}}>
              <div style={{fontWeight:'bold'}}>يومي</div>
              <div style={{fontSize:'1.5rem',color:'#60a5fa'}}>$1</div>
            </div>
            <div style={{background:'#1e3a5f',border:'2px solid #2563eb',borderRadius:'1rem',padding:'1rem 1.5rem',textAlign:'center'}}>
              <div style={{fontWeight:'bold'}}>شهري</div>
              <div style={{fontSize:'1.5rem',color:'#60a5fa'}}>$9.99</div>
            </div>
            <div style={{background:'#1e3a5f',borderRadius:'1rem',padding:'1rem 1.5rem',textAlign:'center'}}>
              <div style={{fontWeight:'bold'}}>سنوي</div>
              <div style={{fontSize:'1.5rem',color:'#60a5fa'}}>$99</div>
            </div>
          </div>
          <button style={{background:'#2563eb',color:'white',padding:'0.75rem 3rem',border:'none',borderRadius:'0.5rem',cursor:'pointer',fontSize:'1.1rem'}}>
            اشترك الآن
          </button>
        </div>
      </div>
    </main>
  )
}