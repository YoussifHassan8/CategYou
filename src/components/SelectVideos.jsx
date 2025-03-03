import React from "react";

const SelectVideos = () => {
  return (
    <div className="absolute px-4 py-3 rounded-lg bg-white dark:bg-[#3E3E3E] shadow-lg border border-gray-200 dark:border-gray-700 space-y-2 w-[300px]">
      <div className="flex items-center">
        <h2 className="ml-auto font-medium text-gray-800 dark:text-white">
          New folder
        </h2>
        <MdCancel
          className="ml-auto cursor-pointer text-gray-500 hover:text-gray-700 
            dark:text-gray-400 dark:hover:text-gray-200 transition-colors text-xl"
          onClick={() => {}}
        />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">Name</p>
      <input
        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500"
        type="text"
        placeholder="Enter the name of the folder"
      />
      <button
        className="flex items-center justify-center gap-2 rounded-xl w-full py-2 
          transition-all duration-300 shadow-sm text-white font-medium text-lg 
          bg-[#FF0033] cursor-pointer hover:bg-[#E60030]"
      >
        Next
      </button>
    </div>
  );
};

export default SelectVideos;
