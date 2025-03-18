import { MdFolder } from "react-icons/md";
const FolderIcon = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400/80 dark:text-gray-500">
      <div className="relative">
        <MdFolder size={180} className="opacity-80" />
      </div>
    </div>
  );
};

export default FolderIcon;
