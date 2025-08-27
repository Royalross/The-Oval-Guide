export default function Loading() {
  return (
    <div className="container-responsive py-6 md:py-8 space-y-6">
      <div className="h-8 w-1/3 bg-muted/60 rounded" />
      <div className="h-6 w-1/4 bg-muted/60 rounded" />
      <div className="h-6 w-1/6 bg-muted/60 rounded" />

      <div className="space-y-3">
        <div className="h-6 w-1/2 bg-muted/60 rounded" />
        <div className="h-20 bg-muted/60 rounded" />
        <div className="h-20 bg-muted/60 rounded" />
      </div>

      <div className="space-y-3">
        <div className="h-6 w-1/3 bg-muted/60 rounded" />
        <div className="h-16 bg-muted/60 rounded" />
      </div>
    </div>
  );
}
