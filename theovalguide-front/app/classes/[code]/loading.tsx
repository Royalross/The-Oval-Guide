export default function Loading() {
  return (
    <div className="container-responsive space-y-6 py-6 md:py-8">
      <div className="bg-muted/60 h-8 w-1/3 rounded" />
      <div className="bg-muted/60 h-6 w-1/4 rounded" />
      <div className="bg-muted/60 h-6 w-1/6 rounded" />

      <div className="space-y-3">
        <div className="bg-muted/60 h-6 w-1/2 rounded" />
        <div className="bg-muted/60 h-20 rounded" />
        <div className="bg-muted/60 h-20 rounded" />
      </div>

      <div className="space-y-3">
        <div className="bg-muted/60 h-6 w-1/3 rounded" />
        <div className="bg-muted/60 h-16 rounded" />
      </div>
    </div>
  );
}
