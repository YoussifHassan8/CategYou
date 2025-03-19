import { MdCancel } from "react-icons/md";
import PropTypes from "prop-types";
import { useState } from "react";

const NamingFolder = ({ folderName, setFolderName, setCurrentWindow }) => {
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!folderName.trim()) {
      setError("Folder name cannot be empty");
      return;
    }

    if (folderName.length > 30) {
      setError("Folder name must be less than 50 characters");
      return;
    }

    setError("");
    setCurrentWindow(2);
  };

  return (
    <div className="absolute z-10 top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 px-4 py-3 rounded-lg bg-white dark:bg-[#3E3E3E] shadow-lg border border-gray-200 dark:border-gray-700 space-y-2 w-[300px]">
      <div className="flex items-center">
        <h2 className="ml-auto font-medium text-gray-800 dark:text-white">
          New folder
        </h2>
        <MdCancel
          className="ml-auto cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors text-xl"
          onClick={() => {
            setCurrentWindow(0);
            setError("");
          }}
        />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300">Name</p>
      <input
        className="w-full px-3 py-2 rounded-lg border placeholder-gray-400 dark:placeholder-gray-50"
        type="text"
        placeholder="Enter the name of the folder"
        value={folderName}
        onChange={(e) => {
          setFolderName(e.target.value);
          setError("");
        }}
        maxLength={30}
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      <button
        className={`flex items-center justify-center gap-2 rounded-xl w-full py-2 transition-all duration-300 shadow-sm text-white font-medium text-lg ${
          folderName.trim()
            ? "bg-[#FF0033] hover:bg-[#E60030] cursor-pointer"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        onClick={handleNext}
        disabled={!folderName.trim()}
      >
        Next
      </button>
    </div>
  );
};

NamingFolder.propTypes = {
  folderName: PropTypes.string.isRequired,
  setFolderName: PropTypes.func.isRequired,
  setCurrentWindow: PropTypes.func.isRequired,
};

export default NamingFolder;
