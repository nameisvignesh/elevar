'use client';

import type { ReactNode } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';

export function AuthProvider({
  publishableKey,
  children,
}: {
  publishableKey: string;
  children: ReactNode;
}) {
  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}
