'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminPage() {
  const [countries, setCountries] = useState<any[]>([])
  const [laws, setLaws] = useState<any[]>([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [form, setForm] = useState({
    title: '',
    category: '',
    law_number: '',
    preview_content: '',
    content: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.from('countries').select('*').order('name_ar')
      .then(({ data }) => { if (data) setCountries(data) })
  }, [])

  useEffect(() => {
    if (!selectedCountry) return
    supabase.from('laws').select('*').eq('country_code', selectedCountry)
      .then(({ data }) => { if (data) setLaws(data) })
  }, [selectedCountry])

  const addLaw = async () => {
    if (!selectedCountry || !form.title) return
    const { error } = await supabase.from('laws').insert({
      country_code: selectedCountry, ...form
    })
    if (error) setMessage('خطأ: ' + error.message)
    else {
      setMessage('تم إضافة القانون بنجاح')
      setForm({ title: '', category: '', law_number: '', preview_content: '', content: '' })
      supabase.from('laws').select('*').eq('country_code', selectedCountry)
        .then(({ data }) => { if (data) setLaws(data) })
    }
  }

  const deleteLaw = async (id: string) => {
    await supabase.from('laws').delete().eq('id', id)
    setLaws(laws.filter(l => l.id !== id))
  }

  return (
    <main style={{minHeight:'100vh',background:'#0a0a0a',color:'white',padding:'2rem'}}>
      <a href="/" style={{color:'#888',textDecoration:'none'}}>الموقع الرئيسي</a>
      <h1 style={{textAlign:'center',fontSize:'2rem',margin:'1rem 0'}}>لوحة التحكم</h1>
      <div style={{maxWidth:'800px',margin:'0 auto'}}>
        <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}
          style={{width:'100%',padding:'0.5rem',marginBottom:'1rem',background:'#222',color:'white',border:'1px solid #444',borderRadius:'0.5rem'}}>
          <option value="">اختر الدولة</option>
          {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name_ar}</option>)}
        </select>
        <input placeholder="عنوان القانون" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
          style={{width:'100%',padding:'0.5rem',marginBottom:'1rem',background:'#222',color:'white',border:'1px solid #444',borderRadius:'0.5rem'}} />
        <input placeholder="التصنيف" value={form.category} onChange={e => setForm({...form, category: e.target.value})}
          style={{width:'100%',padding:'0.5rem',marginBottom:'1rem',background:'#222',color:'white',border:'1px solid #444',borderRadius:'0.5rem'}} />
        <input placeholder="رقم القانون" value={form.law_number} onChange={e => setForm({...form, law_number: e.target.value})}
          style={{width:'100%',padding:'0.5rem',marginBottom:'1rem',background:'#222',color:'white',border:'1px solid #444',borderRadius:'0.5rem'}} />
        <textarea placeholder="المعاينة" value={form.preview_content} onChange={e => setForm({...form, preview_content: e.target.value})}
          rows={3} style={{width:'100%',padding:'0.5rem',marginBottom:'1rem',background:'#222',color:'white',border:'1px solid #444',borderRadius:'0.5rem'}} />
        <textarea placeholder="النص الكامل" value={form.content} onChange={e => setForm({...form, content: e.target.value})}
          rows={6} style={{width:'100%',padding:'0.5rem',marginBottom:'1rem',background:'#222',color:'white',border:'1px solid #444',borderRadius:'0.5rem'}} />
        <button onClick={addLaw}
          style={{background:'#2563eb',color:'white',padding:'0.75rem 2rem',border:'none',borderRadius:'0.5rem',cursor:'pointer'}}>
          إضافة القانون
        </button>
        {message && <p style={{color:'#4ade80',marginTop:'1rem'}}>{message}</p>}
        <div style={{marginTop:'2rem'}}>
          {laws.map(law => (
            <div key={law.id} style={{background:'#111',border:'1px solid #333',borderRadius:'0.5rem',padding:'1rem',marginBottom:'1rem',display:'flex',justifyContent:'space-between'}}>
              <div>
                <div style={{fontWeight:'bold'}}>{law.title}</div>
                <div style={{color:'#888'}}>{law.category}</div>
              </div>
              <button onClick={() => deleteLaw(law.id)}
                style={{background:'#dc2626',color:'white',padding:'0.5rem',border:'none',borderRadius:'0.5rem',cursor:'pointer'}}>
                حذف
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}