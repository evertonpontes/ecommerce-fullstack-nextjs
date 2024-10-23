import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export async function convertBlobUrlToFile(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  const fileName = Math.random().toString(36).slice(2, 9);
  const mimeType = blob.type || 'application/octet-stream';
  const file = new File([blob], `${fileName}.${mimeType.split('/')[1]}`, {
    type: mimeType,
  });

  return file;
}

export async function fileSizeToString(file: File) {
  const fileSize = file.size.toString();

  if (fileSize.length < 7)
    return `${Math.round(+fileSize / 1024).toFixed(2)}kb`;

  return `${(Math.round(+fileSize / 1024) / 1000).toFixed(2)}MB`;
}
