import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import Link from 'next/link';

export default function ComponentsIndex(): React.ReactNode {
  const dir = resolve(process.cwd(), '../../packages/ui/src/components');
  let entries: string[] = [];
  try {
    entries = readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
  } catch {
    entries = [];
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
      <p className="mt-2 text-fg-muted">{entries.length} components scaffolded from Base UI.</p>
      <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {entries.map((name) => (
          <li key={name}>
            <Link
              href={`/components/${name}`}
              className="block rounded-md border border-border-default px-3 py-2 text-sm transition-colors hover:bg-bg-subtle"
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
