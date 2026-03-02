import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDateFromDayOfWeek(dayIndex: number): string {
  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(currentDate);
  monday.setDate(currentDate.getDate() - diff);
  const targetDate = new Date(monday);
  targetDate.setDate(monday.getDate() + dayIndex);
  return targetDate.toISOString().split('T')[0];
}