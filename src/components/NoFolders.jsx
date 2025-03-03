import { MdOutlineFolderOff } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import CreateNewFolder from "./CreateNewFolder";
const NoFolders = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto p-8">
      <MdOutlineFolderOff fontSize={100} />

      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-semibold mb-2 dark:text-white">
          Your Collections
        </h2>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-raleway">
          Create a new collection to organize your favorite videos.
          <br />
          Your personalized collections will appear here.
        </p>
      </div>

      <button
        className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 
        transition-all duration-300 shadow-sm text-white font-medium text-lg bg-[#FF0033] cursor-pointer hover:bg-[#E60030]"
      >
        <IoMdAddCircleOutline className="text-2xl" />
        Create new folder
      </button>
      <CreateNewFolder />
    </div>
  );
};

export default NoFolders;
