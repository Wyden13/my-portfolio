import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Override HTML elements if needed
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-[var(--text-primary)] my-6">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold text-[var(--text-primary)] my-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-medium text-[var(--text-primary)] my-3">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-[var(--text-secondary)] my-4 leading-7">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc list-inside text-[var(--text-secondary)] my-4 space-y-2">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside text-[var(--text-secondary)] my-4 space-y-2">
        {children}
      </ol>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[var(--accent)] pl-4 py-2 my-4 text-[var(--text-secondary)] italic">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-[var(--surface)] px-2 py-1 rounded text-sm text-[var(--text-primary)] font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-[var(--surface)] p-4 rounded-lg overflow-x-auto my-4 text-sm">
        {children}
      </pre>
    ),
    a: ({ href, children }) => (
      <a href={href} className="text-[var(--accent)] hover:underline">
        {children}
      </a>
    ),
  };
}
