import { useState, useEffect } from 'react';
import { fetchSiteContent } from '@/lib/adminSession';
import { PAGE_DEFAULTS, ContentItem } from '@/lib/defaultContent';

export function useSiteContent(page: string) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const result = await fetchSiteContent(page);
      if (cancelled) return;
      
      if (result.content && result.content.length > 0) {
        setContent(result.content as ContentItem[]);
      } else {
        // Fall back to defaults
        setContent(PAGE_DEFAULTS[page] || []);
      }
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
