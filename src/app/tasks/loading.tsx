export default function LoadingTasks() {
    return (
      <main className="p-8">
        {/* Title Skeleton */}
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-6" />
  
        <div className="grid gap-4">
          {/* Generate 3 skeleton cards */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg shadow-sm border-gray-100">
              <div className="flex justify-between items-center mb-4">
                {/* Task Title Skeleton */}
                <div className="h-5 w-1/3 bg-gray-200 animate-pulse rounded" />
                {/* Badge Skeleton */}
                <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-full" />
              </div>
              {/* Description Skeleton Lines */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
                <div className="h-4 w-5/6 bg-gray-100 animate-pulse rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }