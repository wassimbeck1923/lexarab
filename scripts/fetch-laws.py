import requests
from bs4 import BeautifulSoup
from supabase import create_client

# إعدادات Supabase
SUPABASE_URL = "https://hyjcufjyibqhlknssojl.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5amN1Zmp5aWJxaGxrbnNzb2psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0MjAzODksImV4cCI6MjA5Mzk5NjM4OX0.TxMaa7fBuck9Z5Z8cPvYzIyd-lEQqhOChyYZyZe6HHQ"

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_saudi_laws():
    print("جلب القوانين السعودية...")
    url = "https://laws.boe.gov.sa/BoeLaws/Laws/LawDetails/b8e4a5a3-b6e1-4a1e-a5b5-a9b200cecc1e/1"
    headers = {"User-Agent": "Mozilla/5.0"}
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # استخراج العنوان
        title = soup.find('h1')
        if title:
            law_title = title.text.strip()
            
            # التحقق إذا القانون موجود مسبقاً
            existing = supabase.table('laws').select('id').eq('country_code', 'SA').eq('title', law_title).execute()
            
            if not existing.data:
                # إضافة القانون
                supabase.table('laws').insert({
                    'country_code': 'SA',
                    'title': law_title,
                    'category': 'عام',
                    'source_url': url,
                    'preview_content': 'تم جلب هذا القانون تلقائياً من الموقع الرسمي...'
                }).execute()
                print(f"تم إضافة: {law_title}")
            else:
                print(f"موجود مسبقاً: {law_title}")
    except Exception as e:
        print(f"خطأ: {e}")

if __name__ == "__main__":
    fetch_saudi_laws()
    print("انتهى!")