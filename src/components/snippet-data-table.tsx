'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import type { Snippet } from '@/types/snippet';
import { SUPPORTED_LANGUAGES } from '@/types/snippet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// 언어 카테고리
const categories = [
  {
    value: 'all',
    label: 'All',
    filter: () => true,
  },
  {
    value: 'typescript',
    label: 'TypeScript',
    filter: (item: Snippet) => item.language === 'typescript',
  },
  {
    value: 'javascript',
    label: 'JavaScript',
    filter: (item: Snippet) => item.language === 'javascript',
  },
  {
    value: 'python',
    label: 'Python',
    filter: (item: Snippet) => item.language === 'python',
  },
  {
    value: 'go',
    label: 'Go',
    filter: (item: Snippet) => item.language === 'go',
  },
  {
    value: 'rust',
    label: 'Rust',
    filter: (item: Snippet) => item.language === 'rust',
  },
];

interface SnippetDataTableProps {
  data: Snippet[];
}

export function SnippetDataTable({ data }: SnippetDataTableProps) {
  const [category, setCategory] = useState('all');
  const [globalFilter, setGlobalFilter] = useState('');

  // 카테고리별 개수 계산
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach((cat) => {
      counts[cat.value] = data.filter(cat.filter).length;
    });
    return counts;
  }, [data]);

  // 카테고리 필터링
  const filteredData = useMemo(() => {
    const categoryFilter = categories.find((c) => c.value === category);
    if (!categoryFilter) return data;
    return data.filter(categoryFilter.filter);
  }, [data, category]);

  // 테이블 컬럼 정의
  const columns: ColumnDef<Snippet>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => {
        const languageInfo = SUPPORTED_LANGUAGES.find(
          (lang) => lang.value === row.original.language,
        );
        const icon = languageInfo?.icon || '📄';

        return (
          <Link
            href={`/snippets/${row.original.id}`}
            className="flex items-center gap-2 font-medium hover:text-primary"
          >
            <span className="text-xl">{icon}</span>
            <span>{row.original.title}</span>
          </Link>
        );
      },
    },
    {
      accessorKey: 'language',
      header: 'Language',
      cell: ({ row }) => {
        const languageInfo = SUPPORTED_LANGUAGES.find(
          (lang) => lang.value === row.original.language,
        );
        return <Badge variant="outline">{languageInfo?.label || row.original.language}</Badge>;
      },
    },
    {
      accessorKey: 'tags',
      header: 'Tags',
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {row.original.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{row.original.tags.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return (
          <span className="text-sm text-muted-foreground">
            {date.toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        );
      },
    },
    {
      accessorKey: 'author',
      header: 'Author',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.author}</span>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  useEffect(() => {
    setGlobalFilter('');
    setCategory('all');
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* 카테고리 탭 - Desktop */}
      <div className="hidden md:block px-4 lg:px-6">
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1">
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                {cat.label}
                {categoryCounts[cat.value] > 0 && (
                  <Badge variant="secondary">{categoryCounts[cat.value]}</Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* 카테고리 Select - Mobile */}
      <div className="md:hidden px-4 lg:px-6">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label} ({categoryCounts[cat.value]})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 검색 */}
      <div className="px-4 lg:px-6">
        <Input
          placeholder="Search snippets..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* 테이블 */}
      <div className="px-4 lg:px-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} snippet(s)
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="text-sm">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
