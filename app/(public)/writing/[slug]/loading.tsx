export default function PostLoading() {
  return (
    <div className="animate-pulse">
      <div className="container-content pt-8">
        <div className="h-4 w-20 bg-surface-alt rounded" />
      </div>

      <article className="container-content py-10 max-w-3xl">
        {/* Cover image placeholder */}
        <div className="w-full h-72 sm:h-96 rounded-lg bg-surface-alt mb-10" />

        {/* Tags */}
        <div className="flex gap-2 mb-5">
          <div className="h-6 w-16 rounded-full bg-surface-alt" />
          <div className="h-6 w-20 rounded-full bg-surface-alt" />
        </div>

        {/* Title */}
        <div className="space-y-3 mb-5">
          <div className="h-10 w-5/6 bg-surface-alt rounded" />
          <div className="h-10 w-3/4 bg-surface-alt rounded" />
        </div>

        {/* Meta */}
        <div className="flex gap-4 pb-8 border-b border-border mb-10">
          <div className="h-4 w-28 bg-surface-alt rounded" />
          <div className="h-4 w-20 bg-surface-alt rounded" />
        </div>

        {/* Body */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 bg-surface-alt rounded" style={{ width: `${70 + (i % 3) * 10}%` }} />
          ))}
          <div className="h-4 w-full bg-surface-alt rounded" />
          <div className="h-4 w-5/6 bg-surface-alt rounded" />
          <br />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-surface-alt rounded" style={{ width: `${65 + (i % 4) * 8}%` }} />
          ))}
        </div>
      </article>
    </div>
  );
}
