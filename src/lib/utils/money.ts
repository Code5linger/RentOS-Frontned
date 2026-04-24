// src/lib/utils/money.ts
export function formatMoney(amount: string | number, currency = 'BDT'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(num);
}

export function formatMoneyCompact(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (num >= 100_000) return `৳${(num / 100_000).toFixed(1)}L`;
  if (num >= 1_000) return `৳${(num / 1_000).toFixed(1)}K`;
  return `৳${num.toFixed(2)}`;
}
