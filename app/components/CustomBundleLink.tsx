import Link from 'next/link';

export function CustomBundleLink({
  children,
  className = '',
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}) {
  return (
    <Link href="/book-call" className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
