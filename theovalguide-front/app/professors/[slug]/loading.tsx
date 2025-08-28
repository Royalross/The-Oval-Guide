export default function Loading() {
  return (
    <div className="container-responsive space-y-6 py-6 md:py-8">
      <div className="bg-muted/60 h-10 w-1/3 rounded" />
      <div className="grid gap-6 md:grid-cols-12">
        <div className="space-y-4 md:col-span-8">
          <div className="bg-muted/60 h-24 rounded-2xl" />
          <div className="bg-muted/60 h-40 rounded-2xl" />
        </div>
        <div className="space-y-4 md:col-span-4">
          <div className="bg-muted/60 h-36 rounded-2xl" />
          <div className="bg-muted/60 h-24 rounded-2xl" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-12">
        <div className="space-y-3 md:col-span-8">
          <div className="bg-muted/60 h-24 rounded-xl" />
          <div className="bg-muted/60 h-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
