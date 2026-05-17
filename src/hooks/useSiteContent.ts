import { useState, useEffect } from 'react';
import { fetchSiteContent } from '@/lib/adminSession';
import { PAGE_DEFAULTS, ContentItem } from '@/lib/defaultContent';

const cache = new Map<string, ContentItem[]>();
const inflight = new Map<string, Promise<any>>();

export function useSiteContent(page: string) {
  const [content, setContent] = useState<ContentItem[]>(() => cache.get(page) || []);
  const [loading, setLoading] = useState(!cache.has(page));

  useEffect(() => {
    let cancelled = false;
    if (cache.has(page)) {
      setContent(cache.get(page)!);
      setLoading(false);
      return;
    }
    const load = async () => {
      setLoading(true);
      let promise = inflight.get(page);
      if (!promise) { promise = fetchSiteContent(page); inflight.set(page, promise); }
      const result = await promise;
      inflight.delete(page);
      if (cancelled) return;
      const items = (result.content && result.content.length > 0)
        ? (result.content as ContentItem[])
        : (PAGE_DEFAULTS[page] || []);
      cache.set(page, items);
      setContent(items);
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [page]);

  const getItems = (sectionKey: string): ContentItem[] => {
    return content.filter(item => item.section_key === sectionKey);
  };

  const getFirst = (sectionKey: string): ContentItem | undefined => {
    return content.find(item => item.section_key === sectionKey);
  };

  return { content, loading, getItems, getFirst };
}
