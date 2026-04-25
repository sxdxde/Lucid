// HCI: N6 Recognition over Recall — search shows live results, not blank
// HCI: W1 Don't Make Users Think — search is always visible, always responsive
import { useMemo } from 'react';
import { useEmailStore } from '../stores/emailStore';

export function useSearch(query, filters = {}) {
  const { emails } = useEmailStore();

  return useMemo(() => {
    if (!query && !Object.values(filters).some(Boolean)) return [];
    const q = query.toLowerCase().trim();
    return emails.filter(email => {
      if (email.labels.includes('spam') || email.labels.includes('trash')) return false;
      const matchQuery = !q || [
        email.subject,
        email.from.name,
        email.from.email,
        email.preview,
      ].some(field => field?.toLowerCase().includes(q));

      const matchFrom = !filters.from || email.from.email.toLowerCase().includes(filters.from.toLowerCase());
      const matchSubject = !filters.subject || email.subject.toLowerCase().includes(filters.subject.toLowerCase());
      const matchAttachment = !filters.hasAttachment || email.attachments?.length > 0;
      return matchQuery && matchFrom && matchSubject && matchAttachment;
    });
  }, [emails, query, filters]);
}

export function highlightMatch(text, query) {
  if (!query || !text) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    text.slice(0, idx) +
    `<mark class="bg-yellow-200 dark:bg-yellow-700 rounded px-0.5">` +
    text.slice(idx, idx + query.length) +
    '</mark>' +
    text.slice(idx + query.length)
  );
}
