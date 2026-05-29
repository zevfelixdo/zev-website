export default function AboutLoading() {
  return (
    <div className="animate-pulse">
      <section className="section-y container-content">
        <div className="max-w-3xl">
          <div className="h-4 w-16 bg-surface-alt rounded mb-4" />
          <div className="h-14 w-52 bg-surface-alt rounded mb-6" />
          <div className="h-6 w-full max-w-lg bg-surface-alt rounded" />
        </div>
      </section>

      <div className="border-t border-border" />

      <section className="section-y container-content">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-5">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-full bg-surface-alt rounded" />
                <div className="h-4 w-5/6 bg-surface-alt rounded" />
                {i === 1 && <div className="h-4 w-3/4 bg-surface-alt rounded" />}
              </div>
            ))}
          </div>
          <div className="space-y-8">
            <div className="w-full aspect-square rounded-lg bg-surface-alt" />
            <div className="space-y-3">
              <div className="h-3 w-24 bg-surface-alt rounded" />
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-4 w-40 bg-surface-alt rounded" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
