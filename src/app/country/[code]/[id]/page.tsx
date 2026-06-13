'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useParams } from 'next/navigation'

const supabase = createClient(
'https://hyjcufjyibqhlknssojl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5amN1Zmp5aWJxaGxrbnNzb2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MjAzNzUsImV4cCI6MjA2Mzk5NjM3NX0.lEQqh0ChyYZyZe6HHQ'
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
        <h1 style={{fontSize:'1.8rem',marginBottom:'0.5rem'}}>{law.title}</h1>
        {law.title_en && <h2 style={{fontSize:'1.2rem',color:'#aaa',marginBottom:'1rem'}}>{law.title_en}</h2>}
        <div style={{background:'#111',border:'1px solid #333',borderRadius:'0.5rem',padding:'1.5rem',marginBottom:'1rem'}}>
          <p style={{lineHeight:'1.8',fontSize:'1rem'}}>{law.content}</p>
        </div>
        {law.content_en && (
          <div style={{background:'#111',border:'1px solid #2563eb',borderRadius:'0.5rem',padding:'1.5rem'}}>
            <p style={{color:'#60a5fa',marginBottom:'0.5rem',fontSize:'0.9rem'}}>English</p>
            <p style={{lineHeight:'1.8',fontSize:'1rem'}}>{law.content_en}</p>
          </div>
        )}
      </div>
    </main>
  )
}