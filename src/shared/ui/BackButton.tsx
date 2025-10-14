'use client';

import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();

  return (
    <button className="btn btn-secondary" onClick={() => router.back()}>
      목록으로
    </button>
  );
}
