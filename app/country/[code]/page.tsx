'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useParams } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function CountryPage() {
  const params = useParams()
  const code = params.code as string
  const [laws, setLaws] = useState<any[]>([])
  const [country, setCountry] = useState<any>(null)

  useEffect(() => {
    if (!code) return

    supabase.from('countries').select('*').eq('code', code).single()
      .then(({ data }) => setCountry(data))

    supabase.from('laws').select('*').eq('country_code', code)
      .then(({ data, error }) => {
        console.log('laws:', data, 'error:', error)
        if (data) setLaws(data)
      })
  }, [code])

  return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',color:'white',padding:'2rem'}}>
      <a href="/" style={{color:'#888',textDecoration:'none'}}>← رجوع</a>
      <h1 style={{textAlign:'center',fontSize:'2rem',margin:'1rem 0'}}>
        {country?.flag} {country?.name_ar}
      </h1>
      <div style={{maxWidth:'800px',margin:'0 auto'}}>
        {laws.length === 0 ? (
          <p style={{textAlign:'center',color:'#888'}}>لا توجد قوانين بعد</p>
        ) : (
          laws.map((law) => (
            <a href={`/country/${code}/${law.id}`} key={law.id} style={{textDecoration:'none'}}>
              <div style={{background:'#111',border:'1px solid #333',borderRadius:'0.5rem',padding:'1rem',marginBottom:'1rem'}}>
                <div style={{fontWeight:'bold',fontSize:'1.1rem'}}>{law.title}</div>
                <div style={{color:'#888',fontSize:'0.9rem',marginTop:'0.5rem'}}>{law.category}</div>
              </div>
            </a>
          ))
        )}
      </div>
    </main>
  )
}