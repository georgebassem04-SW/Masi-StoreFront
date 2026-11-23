/**
 * PAGE SHELL — gives simple pages the same width, padding and title style.
 *   - Max page width -> "max-w-7xl"   - Title size -> "text-3xl"
 *   - "page-title": dashboard → Theme & design → Layout → Page titles = "Editorial" shows it in light spaced capitals (app/globals.css)
 */
export function PageShell({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="page-title mb-6 text-3xl font-bold">{title}</h1>
      {children}
    </div>
  );
}
