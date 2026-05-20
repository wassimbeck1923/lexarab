import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function CountryPage(props: any) {
  const params = await props.params
  const code = params.code.toUpperCase()

  const { data: country } = await supabase
    .from('countries')
    .select('*')
    .eq('code', code)
    .single()

  const { data: laws } = await supabase
    .from('laws')
    .select('*')
    .eq('country_id', country?.id)

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-blue-400 mb-6 block">← Back</Link>
        <h1 className="text-4xl font-bold mb-2">{country?.name}</h1>
        <p className="text-gray-400 mb-8">Legal System & Laws</p>
        <div className="space-y-4">
          {laws?.map((law) => (
            <div key={law.id} className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <h2 className="text-xl font-semibold mb-3">{law.title}</h2>
              <p className="text-gray-400">{law.content?.substring(0, 200)}...</p>
            </div>
          ))}
          {(!laws || laws.length === 0) && (
            <p className="text-gray-500">No laws added yet.</p>
          )}
        </div>
      </div>
    </main>
  )
}