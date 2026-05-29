export default function CvLoading() {
  return (
    <div className="animate-pulse">
      <section className="section-y container-content">
        <div className="max-w-3xl">
          <div className="h-4 w-24 bg-surface-alt rounded mb-4" />
          <div className="h-14 w-56 bg-surface-alt rounded mb-6" />
          <div className="h-6 w-full max-w-md bg-surface-alt rounded" />
          <div className="h-9 w-28 bg-surface-alt rounded mt-6" />
        </div>
      </section>

      <div className="border-t border-border" />

      <section className="section-y container-content">
        <div className="max-w-3xl space-y-14">
          {[1, 2, 3].map((section) => (
            <div key={section}>
              <div className="h-8 w-48 bg-surface-alt rounded mb-6" />
              <div className="space-y-7">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-6">
                    <div className="w-28 flex-shrink-0">
                      <div className="h-4 w-24 bg-surface-alt rounded" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-3/4 bg-surface-alt rounded" />
                      <div className="h-4 w-1/2 bg-surface-alt rounded" />
                      <div className="h-4 w-full bg-surface-alt rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
