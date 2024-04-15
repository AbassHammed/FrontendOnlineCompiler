import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function random(arr: string[]): string {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export function cn(...classes: ClassValue[]): string {
  return twMerge(clsx(...classes));
}

// Path: src/lib/utils.ts
