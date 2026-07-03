import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="flex flex-col items-center p-6 space-y-8 animate-pulse">
        {/* Detail Image Skeleton */}
        <div className="relative flex justify-center items-center w-full min-h-[300px] mt-4">
          <div className="w-[220px] h-[220px] bg-muted/30 rounded-full flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-muted-foreground/30 animate-spin" />
          </div>
        </div>

        {/* Types Skeleton */}
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-20 h-7 bg-muted/50 rounded-full"></div>
          <div className="w-20 h-7 bg-muted/50 rounded-full"></div>
        </div>

        {/* About Section Skeleton */}
        <div className="w-full max-w-md mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-24 h-6 bg-muted/50 rounded-md"></div>
            <div className="w-32 h-6 bg-muted/30 rounded-full"></div>
          </div>
          <div className="space-y-2 mt-2">
            <div className="w-full h-4 bg-muted/40 rounded-md"></div>
            <div className="w-11/12 h-4 bg-muted/40 rounded-md"></div>
            <div className="w-4/5 h-4 bg-muted/40 rounded-md"></div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="col-span-1 space-y-3">
              <div className="w-16 h-4 bg-muted/40 rounded-md"></div>
              <div className="w-20 h-4 bg-muted/40 rounded-md"></div>
              <div className="w-16 h-4 bg-muted/40 rounded-md"></div>
            </div>
            <div className="col-span-2 space-y-3">
              <div className="w-32 h-4 bg-muted/30 rounded-md"></div>
              <div className="w-24 h-4 bg-muted/30 rounded-md"></div>
              <div className="w-28 h-4 bg-muted/30 rounded-md"></div>
            </div>
          </div>
        </div>

        {/* Stats Section Skeleton */}
        <div className="w-full max-w-md mx-auto space-y-4 pt-6">
          <div className="w-32 h-6 bg-muted/50 rounded-md mb-4"></div>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="w-12 h-4 bg-muted/40 rounded-md"></div>
              <div className="w-8 h-4 bg-muted/40 rounded-md"></div>
              <div className="flex-1 h-2 bg-muted/20 rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-muted/40 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
