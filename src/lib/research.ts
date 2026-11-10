export type Status = 'unread' | 'reading' | 'read';

export interface Paper {
  arxiv_id: string;
  url: string;
  title: string;
  authors: string;
  date: string;
  topic: string;
  abstract_summary: string;
  conclusion_summary: string | null;
  note: string | null;
  status: Status;
  added: string; // YYYY-MM-DD
  my_notes: string;
}

export interface LogEntry {
  date: string;
  title?: string;
  did: string[];
  found: string[];
  papers_added: string[];
  open_questions: string[];
  next_steps: string[];
}

export const STATUSES: Status[] = ['unread', 'reading', 'read'];

export const statusBadge: Record<Status, string> = {
  unread: 'badge-ghost',
  reading: 'badge-warning',
  read: 'badge-success',
};

// Topic group colours (daisyUI colour names), assigned by order of first appearance.
const palette = ['primary', 'secondary', 'accent', 'info', 'success', 'warning'];
export const topicColors = (papers: Paper[]) => {
  const map = new Map<string, string>();
  for (const p of papers) if (!map.has(p.topic)) map.set(p.topic, palette[map.size % palette.length]);
  return map;
};

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Monday of the week containing the given YYYY-MM-DD date (UTC).
export const weekStart = (iso: string) => {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
};

export const progress = (papers: Paper[]) => {
  const perWeek = new Map<string, number>();
  for (const p of papers) {
    const w = weekStart(p.added);
    perWeek.set(w, (perWeek.get(w) ?? 0) + 1);
  }
  const weeks = [...perWeek.entries()].sort(([a], [b]) => a.localeCompare(b));
  const counts = Object.fromEntries(STATUSES.map((s) => [s, papers.filter((p) => p.status === s).length])) as Record<Status, number>;
  return { weeks, counts, total: papers.length };
};

export const formatDate = (iso: string) =>
  new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
