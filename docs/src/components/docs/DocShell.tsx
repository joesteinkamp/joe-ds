"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDensity } from "@js-ds-ui/components";
import { useTheme } from "@js-ds-ui/components";

const NAV_SECTIONS = [
  {
    title: "Getting Started",
    items: [
      { label: "Overview", href: "/" },
      { label: "Components", href: "/components" },
    ],
  },
  {
    title: "Foundations",
    items: [
      { label: "Themes", href: "/foundations/theme" },
      { label: "Density", href: "/foundations/density" },
      { label: "Tokens", href: "/foundations/tokens" },
      { label: "Color Generator", href: "/foundations/color-generator" },
    ],
  },
];

export default function DocShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { density, setDensity } = useDensity();

  return (
    <div className="docs-shell">
      <aside className="docs-sidebar">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="docs-nav-group">
            <div className="docs-nav-title">{section.title}</div>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="docs-nav-link"
                data-active={pathname === item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </aside>
      <div>
        <header className="docs-header">
          <Link href="/">js-ds-ui</Link>
          <div className="docs-toolbar">
            <label>
              Theme{" "}
              <select
                value={theme}
                onChange={(event) => setTheme(event.target.value as typeof theme)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="high-contrast">High contrast</option>
              </select>
            </label>
            <label>
              Density{" "}
              <select
                value={density}
                onChange={(event) => setDensity(event.target.value as typeof density)}
              >
                <option value="compact">Compact</option>
                <option value="default">Default</option>
                <option value="comfortable">Comfortable</option>
              </select>
            </label>
          </div>
        </header>
        <main className="docs-main">{children}</main>
      </div>
    </div>
  );
}
