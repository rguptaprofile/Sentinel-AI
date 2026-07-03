export function ModuleGrid({ modules }: { modules: string[] }) {
  return (
    <section className="module-grid" aria-label="SentinelAI modules">
      {modules.map((module) => (
        <article className="module-card" key={module}>
          <h2>{module}</h2>
          <p>Structure ready for API integration and feature implementation.</p>
        </article>
      ))}
    </section>
  );
}
