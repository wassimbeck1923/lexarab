const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const laws = [
  { title: 'دستور', category: 'دستور', law_number: '51', country_code: 'SA' },
  { title: 'قانون العمل', category: 'عمل', law_number: '3', country_code: 'SA' },
  { title: 'قانون الأحوال', category: 'أحوال', law_number: '33', country_code: 'SA' },
];

async function fetchLaws() {
  console.log('جاري إدخال البيانات...');
  for (const law of laws) {
    const { error } = await supabase
      .from('laws')
      .upsert(law, { onConflict: 'law_number' });
    if (error) {
      console.log('خطأ:', error.message);
    } else {
      console.log('تمت إضافة:', law.title);
    }
  }
  console.log('انتهى!');
}

fetchLaws();