import 'server-only';

import { z } from 'zod';

/**
 * Supabase 환경 변수 스키마
 * 앱 시작 시 환경 변수를 검증하여 런타임 에러를 방지합니다.
 *
 * - 'server-only'로 제한되어 클라이언트에서 접근 불가
 * - Server Actions에서만 사용
 */
const supabaseEnvSchema = z.object({
  SUPABASE_URL: z.string().url('유효한 Supabase URL이 필요합니다'),
  SUPABASE_ANON_KEY: z.string().min(1, 'Supabase Anon Key는 필수입니다'),
});

/**
 * 환경 변수 검증 및 파싱
 * 환경 변수가 유효하지 않으면 앱 시작 시 즉시 에러를 발생시킵니다.
 */
export const supabaseEnv = supabaseEnvSchema.parse({
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
});
