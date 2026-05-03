import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import type { ReactNode } from 'react';

export default function HomePage(): ReactNode {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">joe-ds</h1>
          <p className="mt-2 text-fg-muted">
            Design system on Base UI + Tailwind v4 + DESIGN.md tokens.
          </p>
        </div>
        <ThemeToggle />
      </header>

      <section className="space-y-6">
        <Card title="Tokens" href="/tokens">
          Inspect primitive ramps and semantic mappings emitted from{' '}
          <code className="font-mono text-sm">DESIGN.md</code>.
        </Card>
        <Card title="Components" href="/components">
          Per-component previews of every Base UI primitive scaffolded with{' '}
          <code className="font-mono text-sm">*.tokens.json</code>.
        </Card>
      </section>
    </main>
  );
}

function Card({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: ReactNode;
}): ReactNode {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-border-default bg-bg-default p-6 transition-colors hover:bg-bg-subtle"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-fg-muted">{children}</p>
    </Link>
  );
}
