const DropAreaAlert = () => {
  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full h-full flex items-center justify-center bg-blue-500/10 dark:bg-blue-500/15">
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 border-2 border-dashed border-blue-400/80 rounded-full dark:border-blue-300/60 animate-spin-slow" />
        <span className="mt-3 text-blue-500/90 font-medium dark:text-blue-300/90 text-sm tracking-wide">
          RELEASE TO MOVE
        </span>
      </div>
    </div>
  );
};

export default DropAreaAlert;
