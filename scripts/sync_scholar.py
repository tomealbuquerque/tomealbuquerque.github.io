"""Fetch Scholar data at build time. API credentials never enter the website."""
import json, os, sys, time
from pathlib import Path
from datetime import datetime, timezone
from urllib.request import Request, urlopen
from urllib.parse import urlencode

AUTHOR = 'RfeLaPEAAAAJ'
TARGET = Path('public/data/scholar.json')

def request_json(url):
    for attempt in range(3):
        try:
            with urlopen(Request(url, headers={'User-Agent':'ResearchPortfolio/1.0'}), timeout=45) as response:
                return json.load(response)
        except Exception:
            if attempt == 2:
                raise RuntimeError('Scholar request failed; check API quota and service availability.') from None
            time.sleep(2 ** attempt)

def integer(value):
    if value is None or isinstance(value, bool): return None
    try: return max(0, int(value))
    except (ValueError, TypeError): return None

def collect(api_key, getter=request_json):
    articles, seen, first = [], set(), None
    for start in range(0, 2000, 100):
        query=urlencode({'engine':'google_scholar_author','author_id':AUTHOR,'api_key':api_key,'hl':'en','num':100,'start':start,'sort':'pubdate'})
        page=getter('https://serpapi.com/search.json?'+query)
        if page.get('error'): raise RuntimeError('Scholar provider returned an error; inspect account quota.')
        if first is None: first=page
        batch=page.get('articles')
        if not isinstance(batch,list): raise RuntimeError('Scholar response did not contain articles.')
        added=0
        for item in batch:
            title=str(item.get('title','')).strip()
            key=item.get('citation_id') or title.casefold()
            if not title or key in seen: continue
            seen.add(key); added+=1
            articles.append({'title':title,'authors':str(item.get('authors','')),'venue':str(item.get('publication','')),'year':integer(item.get('year')),'url':item.get('link',''),'citations':integer((item.get('cited_by') or {}).get('value')),'selected':False})
        if not batch or (len(batch)<100 and not (page.get('serpapi_pagination') or {}).get('next')): break
        if not added: raise RuntimeError('Repeated Scholar pagination; refusing partial results.')
    else: raise RuntimeError('Scholar pagination safety limit reached; refusing partial results.')
    if not articles: raise RuntimeError('Empty Scholar record; retaining previous data.')
    metrics={}
    for row in (first.get('cited_by') or {}).get('table',[]):
        for key in ('citations','h_index','i10_index'):
            if key in row: metrics[key]=integer(row[key].get('all'))
    if not all(metrics.get(k) is not None for k in ('citations','h_index','i10_index')):
        raise RuntimeError('Incomplete Scholar metrics; retaining previous data.')
    return {'source':'Google Scholar','updated_at':datetime.now(timezone.utc).isoformat(),'metrics':metrics,'articles':articles}

def main():
    # Recover the last deployed successful snapshot before attempting a refresh.
    base=os.environ.get('SITE_URL','').rstrip('/')
    if base.startswith('https://'):
        try:
            previous=request_json(base+'/data/scholar.json')
            if previous.get('source')=='Google Scholar' and previous.get('updated_at') and previous.get('articles'):
                TARGET.write_text(json.dumps(previous,ensure_ascii=False,indent=2),encoding='utf-8')
        except Exception: pass
    key=os.environ.get('SERPAPI_KEY','').strip()
    if not key:
        print('::warning::SERPAPI_KEY is not configured. Publishing the available snapshot, not a live update.')
        return
    try:
        data=collect(key)
    except Exception as exc:
        print('::warning::'+str(exc))
        # No API URL or secret is printed. Existing snapshot and timestamp remain unchanged.
        return
    TARGET.parent.mkdir(parents=True,exist_ok=True)
    temporary=TARGET.with_suffix('.tmp')
    temporary.write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    temporary.replace(TARGET)
    print('Scholar synchronization succeeded: '+str(len(data['articles']))+' publications.')

if __name__=='__main__': main()
