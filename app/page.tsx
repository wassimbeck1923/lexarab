import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Home() {
  const { data: countries } = await supabase
    .from('countries')
    .select('*')
    .order('name')

  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">LexArab AI</h1>
        <p className="text-center text-gray-400 mb-10">Global Legal Intelligence Platform</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {countries?.map((country) => (
            <Link href={`/country/${country.code}`} key={country.id}>
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500 cursor-pointer transition">
                <h2 className="text-2xl font-semibold">{country.flag_emoji} {country.name}</h2>
                <p className="text-gray-400 mt-2">Browse laws and legal systems</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}