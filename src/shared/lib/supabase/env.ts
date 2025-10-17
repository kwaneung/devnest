import 'server-only';

import { z } from 'zod';

/**
 * Supabase 환경 변수 스키마
 * 앱 시작 시 환경 변수를 검증하여 런타임 에러를 방지합니다.
 */
const supabaseEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('유효한 Supabase URL이 필요합니다'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase Anon Key는 필수입니다'),
});

/**
 * 환경 변수 검증 및 파싱
 * 환경 변수가 유효하지 않으면 앱 시작 시 즉시 에러를 발생시킵니다.
 */
export const supabaseEnv = supabaseEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});
