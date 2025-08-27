export default function Loading() {
  return (
    <div className="container-responsive py-6 md:py-8 space-y-6">
      <div className="h-10 w-1/3 bg-muted/60 rounded" />
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8 space-y-4">
          <div className="h-24 bg-muted/60 rounded-2xl" />
          <div className="h-40 bg-muted/60 rounded-2xl" />
        </div>
        <div className="md:col-span-4 space-y-4">
          <div className="h-36 bg-muted/60 rounded-2xl" />
          <div className="h-24 bg-muted/60 rounded-2xl" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-8 space-y-3">
          <div className="h-24 bg-muted/60 rounded-xl" />
          <div className="h-24 bg-muted/60 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
