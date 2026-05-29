export default function WorkLoading() {
  return (
    <div className="animate-pulse">
      <section className="section-y container-content">
        <div className="max-w-3xl">
          <div className="h-4 w-20 bg-surface-alt rounded mb-4" />
          <div className="h-14 w-48 bg-surface-alt rounded mb-6" />
          <div className="h-6 w-full max-w-md bg-surface-alt rounded" />
        </div>
      </section>

      <div className="border-t border-border" />

      <section className="section-y container-content">
        <div className="grid grid-cols-1 gap-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              <div className="aspect-video rounded-xl bg-surface-alt" />
              <div className="space-y-4">
                <div className="h-4 w-24 bg-surface-alt rounded" />
                <div className="h-8 w-3/4 bg-surface-alt rounded" />
                <div className="h-4 w-full bg-surface-alt rounded" />
                <div className="h-4 w-5/6 bg-surface-alt rounded" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 rounded-full bg-surface-alt" />
                  <div className="h-6 w-20 rounded-full bg-surface-alt" />
                  <div className="h-6 w-14 rounded-full bg-surface-alt" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
