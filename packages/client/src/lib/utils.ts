import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) =>
  twMerge(clsx(inputs));

export const stripHtmlTags = (html: string): string => {
  const tmp = document.createElement(`DIV`);
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || ``;
};
