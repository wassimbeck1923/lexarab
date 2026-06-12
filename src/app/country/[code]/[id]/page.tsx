'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useParams } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LawPage() {
  const params = useParams()
  const code = params.code as string
  const id = params.id as string
  const [law, setLaw] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    supabase.from('laws').select('*').eq('id', id).single()
      .then(({ data }) => setLaw(data))
  }, [id])

  if (!law) return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',color:'white',padding:'2rem'}}>
      <p style={{textAlign:'center'}}>جاري التحميل...</p>
    </main>
  )

  return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',color:'white',padding:'2rem'}}>
      <a href={`/country/${code}`} style={{color:'#888',textDecoration:'none'}}>← رجوع</a>
      <div style={{maxWidth:'800px',margin:'2rem auto'}}>
        <h1 style={{fontSize:'1.8rem',marginBottom:'1rem'}}>{law.title}</h1>
        <div style={{background:'#111',border:'1px solid #333',borderRadius:'0.5rem',padding:'1.5rem'}}>
          <p style={{lineHeight:'1.8',fontSize:'1rem'}}>{law.content}</p>
        </div>
      </div>
    </main>
  )
}