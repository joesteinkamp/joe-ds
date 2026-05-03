import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<ReactNode> {
  const { slug } = await params;
  const dir = resolve(process.cwd(), '../../packages/ui/src/components', slug);
  if (!existsSync(dir)) notFound();

  let tokens = '';
  let tsx = '';
  try {
    tokens = readFileSync(resolve(dir, `${slug}.tokens.json`), 'utf8');
  } catch {
    tokens = '(no tokens.json)';
  }
  try {
    tsx = readFileSync(resolve(dir, `${slug}.tsx`), 'utf8');
  } catch {
    tsx = '(no tsx)';
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/components" className="text-sm text-fg-muted hover:text-fg-default">
        ← Components
      </Link>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{slug}</h1>

      <h2 className="mt-8 text-lg font-semibold">tokens</h2>
      <pre className="mt-2 overflow-auto rounded-md border border-border-default bg-bg-subtle p-4 font-mono text-xs">
        {tokens}
      </pre>

      <h2 className="mt-8 text-lg font-semibold">component</h2>
      <pre className="mt-2 overflow-auto rounded-md border border-border-default bg-bg-subtle p-4 font-mono text-xs">
        {tsx}
      </pre>
    </main>
  );
}
