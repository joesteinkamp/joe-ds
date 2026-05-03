import design from '../../../../tokens/design.json';

type DtcgValue = {
  hex?: string;
  components?: number[];
  alpha?: number;
};

type Node = {
  $type?: string;
  $value?: DtcgValue | string | number;
  [key: string]: unknown;
};

function flatten(
  node: Node,
  prefix: string[] = [],
): Array<{ path: string; value: string; type?: string }> {
  const out: Array<{ path: string; value: string; type?: string }> = [];
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    const c = child as Node;
    if (c && typeof c === 'object' && '$value' in c) {
      const v = c.$value;
      let str = '';
      if (typeof v === 'string' || typeof v === 'number') str = String(v);
      else if (v && typeof v === 'object') str = (v as DtcgValue).hex ?? JSON.stringify(v);
      out.push({ path: [...prefix, key].join('.'), value: str, type: c.$type });
    } else if (c && typeof c === 'object') {
      out.push(...flatten(c, [...prefix, key]));
    }
  }
  return out;
}

export default function TokensPage(): React.ReactNode {
  const tokens = flatten(design as Node);
  const colors = tokens.filter((t) => t.type === 'color' || t.path.startsWith('color.'));
  const others = tokens.filter((t) => !t.path.startsWith('color.'));

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Tokens</h1>
      <p className="mt-2 text-fg-muted">
        Generated from <code className="font-mono text-sm">DESIGN.md</code>.
      </p>

      <h2 className="mt-12 text-xl font-semibold">Colors</h2>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {colors.map((t) => {
          const name = t.path.replace(/^color\./, '');
          return (
            <div
              key={t.path}
              className="flex items-center gap-3 rounded-md border border-border-default p-3"
            >
              <span
                className="block h-8 w-8 rounded border border-border-default"
                style={{ backgroundColor: `var(--${name})` }}
              />
              <div className="min-w-0">
                <code className="block truncate font-mono text-xs">--{name}</code>
                <span className="block truncate text-xs text-fg-muted">{t.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="mt-12 text-xl font-semibold">Other</h2>
      <ul className="mt-4 space-y-1 font-mono text-sm">
        {others.map((t) => (
          <li key={t.path} className="text-fg-muted">
            <span className="text-fg-default">{t.path}</span>: {t.value}
          </li>
        ))}
      </ul>
    </main>
  );
}
