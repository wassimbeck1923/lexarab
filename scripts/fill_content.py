import sys
sys.stdout.reconfigure(encoding="utf-8")
from dotenv import load_dotenv
load_dotenv()
import requests
from bs4 import BeautifulSoup
from supabase import create_client
import os
import time

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def fetch_text(url):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        r = requests.get(url, headers=headers, timeout=15)
        r.encoding = "utf-8"
        soup = BeautifulSoup(r.text, "html.parser")
        for tag in soup(["script","style","nav","header","footer"]):
            tag.decompose()
        text = soup.get_text(separator="\n", strip=True)
        return text[:5000]
    except Exception as e:
        print(f"  خطأ: {e}")
        return None

def fill_empty_laws():
    print("جلب القوانين الفارغة...")
    laws = supabase.table("laws").select("*").is_("content", "null").execute()
    total = len(laws.data)
    print(f"عدد القوانين الفارغة: {total}")
    filled = 0
    errors = 0
    for i, law in enumerate(laws.data, 1):
        title = law.get("title", "")
        url = law.get("source_url", "")
        law_id = law.get("id")
        print(f"[{i}/{total}] {title}")
        if not url:
            print("  لا يوجد رابط")
            errors += 1
            continue
        content = fetch_text(url)
        if content and len(content) > 100:
            supabase.table("laws").update({"content": content}).eq("id", law_id).execute()
            print(f"  تم ({len(content)} حرف)")
            filled += 1
        else:
            print("  فشل الجلب")
            errors += 1
        time.sleep(2)
    print(f"\nمكتمل: {total} | مملوء: {filled} | أخطاء: {errors}")

if __name__ == "__main__":
    fill_empty_laws()
