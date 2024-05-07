import { type ThemeValue } from '@/components/Topbar/AvatarPop';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function random(arr: string[]): string {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export function stringToTheme(theme: string): ThemeValue {
  return theme as ThemeValue;
}
