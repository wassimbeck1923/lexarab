from dotenv import load_dotenv
load_dotenv()
import requests
from bs4 import BeautifulSoup
import hashlib
from datetime import datetime
from supabase import create_client
import os
import time
from scraper_config import COUNTRY_SOURCES

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_content_hash(text):
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

def fetch_law_text(url, encoding='utf-8'):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'ar,en;q=0.9'
    }
    try:
        response = requests.get(url, headers=headers, timeout=30)
        response.encoding = encoding
        soup = BeautifulSoup(response.text, 'html.parser')
        for tag in soup(['script', 'style', 'nav', 'footer', 'header']):
            tag.decompose()
        main = (
            soup.find('main') or
            soup.find('article') or
            soup.find('div', class_='content') or
            soup.find('div', class_='law-text') or
            soup.body
        )
        return main.get_text(separator='\n', strip=True) if main else None
    except Exception as e:
        print(f"    خطأ في الجلب: {e}")
        return None

def check_and_update_law(law):
    source_url = law.get('source_url')
    if not source_url:
        print(f"    لا يوجد رابط: {law['title']}")
        return False

    country_code = law.get('country_code', '')
    config = COUNTRY_SOURCES.get(country_code, {})
    encoding = config.get('encoding', 'utf-8')
    new_text = fetch_law_text(source_url, encoding)
    if not new_text:
        return False

    new_hash = get_content_hash(new_text)
    current_hash = law.get('content_hash', '')

    supabase.table('laws').update({
        'last_checked': datetime.now().isoformat()
    }).eq('id', law['id']).execute()

    if new_hash == current_hash:
        print(f"    لا تغيير")
        return False

    print(f"    تحديث مكتشف - جاري الحفظ...")

    supabase.table('law_history').insert({
        'law_id': law['id'],
        'old_text': law.get('full_text', ''),
        'old_hash': current_hash,
        'archived_at': datetime.now().isoformat()
    }).execute()

    supabase.table('laws').update({
        'full_text': new_text,
        'content_hash': new_hash,
        'is_updated': True,
        'last_checked': datetime.now().isoformat()
    }).eq('id', law['id']).execute()

    print(f"    تم التحديث بنجاح")
    return True

def run_all_countries():
    print(f"\n{'='*50}")
    print(f"بدء الجلب التلقائي")
    print(f"الوقت: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*50}\n")

    laws = supabase.table('laws').select(
        'id, title, country_code, source_url, content_hash, full_text'
    ).execute()

    if not laws.data:
        print("لا توجد قوانين في قاعدة البيانات")
        return

    total = len(laws.data)
    updated = 0
    errors = []

    for i, law in enumerate(laws.data, 1):
        country = COUNTRY_SOURCES.get(law.get('country_code', ''), {})
        country_name = country.get('name', law.get('country_code', ''))
        print(f"[{i}/{total}] {country_name} - {law['title']}")
        try:
            was_updated = check_and_update_law(law)
            if was_updated:
                updated += 1
        except Exception as e:
            print(f"    خطأ: {e}")
            errors.append(law['title'])
        time.sleep(1)

    print(f"\n{'='*50}")
    print(f"اكتمل - الكل: {total} | محدّث: {updated} | أخطاء: {len(errors)}")
    print(f"{'='*50}\n")

if __name__ == "__main__":
    run_all_countries()