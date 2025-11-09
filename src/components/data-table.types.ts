import { z } from 'zod';

export const dataTableSchema = z.object({
  id: z.number(),
  title: z.string(),
  tags: z.array(z.string()),
  status: z.string(),
  publishedAt: z.string(),
  viewCount: z.number(),
  author: z.string(),
});

export type DataTableItem = z.infer<typeof dataTableSchema>;
