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

        {/* شارة محدّث */}
        {law.is_updated && (
          <div style={{
            display:'inline-flex',
            alignItems:'center',
            gap:'0.5rem',
            background:'#065f46',
            border:'1px solid #10b981',
            borderRadius:'20px',
            padding:'0.3rem 1rem',
            marginBottom:'1rem',
            fontSize:'0.85rem',
            color:'#10b981'
          }}>
            <span>✓</span>
            <span>محدّث مؤخراً</span>
          </div>
        )}

        <h1 style={{fontSize:'1.8rem',marginBottom:'0.5rem'}}>{law.title}</h1>

        {law.title_en && (
          <h2 style={{fontSize:'1.2rem',color:'#aaa',marginBottom:'1rem'}}>{law.title_en}</h2>
        )}

        {/* معلومات القانون */}
        <div style={{
          display:'flex',
          gap:'1rem',
          marginBottom:'1.5rem',
          flexWrap:'wrap'
        }}>
          {law.category && (
            <span style={{
              background:'#1a1a2e',
              border:'1px solid #333',
              borderRadius:'8px',
              padding:'0.3rem 0.8rem',
              fontSize:'0.85rem',
              color:'#aaa'
            }}>{law.category}</span>
          )}
          {law.law_number && (
            <span style={{
              background:'#1a1a2e',
              border:'1px solid #333',
              borderRadius:'8px',
              padding:'0.3rem 0.8rem',
              fontSize:'0.85rem',
              color:'#aaa'
            }}>رقم: {law.law_number}</span>
          )}
          {law.issued_date && (
            <span style={{
              background:'#1a1a2e',
              border:'1px solid #333',
              borderRadius:'8px',
              padding:'0.3rem 0.8rem',
              fontSize:'0.85rem',
              color:'#aaa'
            }}>تاريخ: {law.issued_date}</span>
          )}
          {law.last_checked && (
            <span style={{
              background:'#1a1a2e',
              border:'1px solid #333',
              borderRadius:'8px',
              padding:'0.3rem 0.8rem',
              fontSize:'0.85rem',
              color:'#555'
            }}>آخر فحص: {new Date(law.last_checked).toLocaleDateString('ar')}</span>
          )}
        </div>

        {/* محتوى القانون */}
        <div style={{
          background:'#111',
          border:'1px solid #333',
          borderRadius:'12px',
          padding:'1.5rem',
          marginBottom:'1rem'
        }}>
          <p style={{lineHeight:'1.8',fontSize:'1rem'}}>{law.content}</p>
        </div>

        {/* المحتوى الإنجليزي */}
        {law.content_en && (
          <div style={{
            background:'#111',
            border:'1px solid #2563eb',
            borderRadius:'12px',
            padding:'1.5rem'
          }}>
            <p style={{color:'#60a5fa',marginBottom:'0.5rem',fontSize:'0.9rem'}}>English Version</p>
            <p style={{lineHeight:'1.8',fontSize:'1rem'}}>{law.content_en}</p>
          </div>
        )}

      </div>
    </main>
  )
}