'use client';

import { useRouter } from 'next/navigation';
import { MessageCircleMore } from 'lucide-react';

export function ChatbotButton() {
  const router = useRouter();

  return (
    <button
      className="chatbot btn btn-primary"
      style={{ borderRadius: 6, width: 56, height: 56, display: 'grid', placeItems: 'center', boxShadow: 'var(--shadow)' }}
      aria-label="Open chat support"
      onClick={() => router.push('/chat')}
      type="button"
    >
      <MessageCircleMore size={22} />
    </button>
  );
}
