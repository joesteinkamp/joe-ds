import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href, ...props }) =>
      href ? <Link href={href} {...props} /> : <a {...props} />,
    h1: (props) => <h1 className="docs-h1" {...props} />,
    h2: (props) => <h2 className="docs-h2" {...props} />,
    h3: (props) => <h3 className="docs-h3" {...props} />,
    p: (props) => <p className="docs-paragraph" {...props} />,
    ul: (props) => <ul className="docs-list" {...props} />,
    ol: (props) => <ol className="docs-list" {...props} />,
    code: (props) => <code className="docs-code" {...props} />,
    pre: (props) => <pre className="docs-pre" {...props} />,
    ...components,
  };
}
