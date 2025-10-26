import 'server-only';

import { createClient } from '@supabase/supabase-js';

import { supabaseEnv } from './env';
import type { Database } from './types';

/**
 * Server-only Supabase 클라이언트 인스턴스
 *
 * 환경 변수는 Zod 스키마로 검증되어 타입 안전성이 보장됩니다.
 * 유효하지 않은 환경 변수가 있으면 앱 시작 시 즉시 에러가 발생합니다.
 *
 * IMPORTANT: 이 클라이언트는 Server Actions와 API Routes에서만 사용 가능합니다.
 * Client Components에서 import 시도 시 빌드 타임 에러가 발생합니다.
 *
 * @example
 * // ✅ Server Action에서 사용
 * 'use server';
 * import { supabase } from '@/shared/lib/supabase';
 *
 * // ❌ Client Component에서 사용 불가
 * 'use client';
 * import { supabase } from '@/shared/lib/supabase'; // Build Error!
 */
export const supabase = createClient<Database>(
  supabaseEnv.SUPABASE_URL,
  supabaseEnv.SUPABASE_ANON_KEY,
);
