export default function LoginLoading() {
  return (
    <div className="w-full max-w-md space-y-8 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-32 animate-pulse rounded-md bg-gray-200" />
          <div className="h-4 w-48 animate-pulse rounded-md bg-gray-200" />
        </div>

        {/* Form fields skeleton */}
        <div className="space-y-4">
          <div className="h-10 animate-pulse rounded-md bg-gray-200" />
          <div className="h-10 animate-pulse rounded-md bg-gray-200" />
        </div>

        {/* Button skeleton */}
        <div className="h-10 animate-pulse rounded-md bg-gray-200" />
      </div>
    </div>
  );
}
