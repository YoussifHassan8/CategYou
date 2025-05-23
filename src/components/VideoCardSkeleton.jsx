const VideoCardSkeleton = () => {
  return (
    <li className="rounded-lg overflow-hidden space-y-2">
      <div className="w-full aspect-video bg-gray-200 animate-pulse rounded" />

      <div className="space-y-2">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-[90%]" />
          <div className="h-6 bg-gray-200 rounded animate-pulse w-[40%]" />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-[150px]" />
        </div>

        <div className="flex gap-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-[100px]" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-[80px]" />
        </div>
      </div>
    </li>
  );
};

export default VideoCardSkeleton;
