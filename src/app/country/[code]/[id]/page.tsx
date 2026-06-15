import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function LawPage({ params }: { params: { code: string, id: string } }) {
  const { data: law } = await supabase
    .from('laws')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!law) return notFound()

  return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',color:'white',padding:'2rem'}}>
      <a href={`/country/${params.code}`} style={{color:'#888',textDecoration:'none'}}>→ رجوع</a>
      <div style={{maxWidth:'800px',margin:'2rem auto'}}>
        <h1 style={{fontSize:'1.8rem',margin:'1rem 0'}}>{law.title}</h1>
        <p style={{color:'#888',marginBottom:'2rem'}}>{law.category} — {law.country_code}</p>
        <div style={{background:'#111',border:'1px solid #333',borderRadius:'8px',padding:'1.5rem'}}>
          <p style={{lineHeight:'1.8',fontSize:'1rem'}}>{law.content}</p>
        </div>
        {law.content_en && (
          <div style={{background:'#111',border:'1px solid #2563eb',borderRadius:'8px',padding:'1.5rem',marginTop:'1rem'}}>
            <p style={{color:'#60a5fa',marginBottom:'0.5rem',fontSize:'0.9rem'}}>English</p>
            <p style={{lineHeight:'1.8',fontSize:'1rem'}}>{law.content_en}</p>
          </div>
        )}
      </div>
    </main>
  )
}