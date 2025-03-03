const HeaderSkeleton = () => {
  return (
    <div className="flex my-6 items-center gap-3 max-sm:flex-col max-sm:justify-center max-sm:text-center">
      <div className="w-[212px] h-[212px] rounded-full bg-gray-200 animate-pulse" />
      <div className="space-y-2 font-poppins">
        {/* Name skeleton */}
        <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />

        {/* Button skeleton */}
        <div className="h-11 w-32 bg-gray-200 rounded-xl animate-pulse" />

        {/* Stats skeleton */}
        <div className="flex flex-wrap gap-2 text-sm">
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Bio skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default HeaderSkeleton;
