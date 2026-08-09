'use client';

import { useRouter } from 'next/navigation';

export function CustomBundleButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const router = useRouter();
  return (
    <button className={`btn btn-primary ${className}`} onClick={() => router.push('/book-call')}>
      {children}
    </button>
  );
}
