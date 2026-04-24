// src/lib/utils/date.ts
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-BD', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function formatMonth(dateStr: string): string {
  return new Intl.DateTimeFormat('en-BD', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function isOverdue(dueDateStr: string): boolean {
  return new Date(dueDateStr) < new Date();
}

export function daysUntilDue(dueDateStr: string): number {
  const diff = new Date(dueDateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
